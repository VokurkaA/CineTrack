/**
 * URL for the live community-sourced repository of AAGUIDs.
 * Source: https://passkeydeveloper.github.io/passkey-authenticator-aaguids/
 */
const AAGUID_DATA_URL = "https://raw.githubusercontent.com/passkeydeveloper/passkey-authenticator-aaguids/main/aaguid.json";

export interface AAGUIDData {
    [aaguid: string]: {
        name: string; icon_light?: string; icon_dark?: string;
    };
}

let cachedAAGUIDMap: AAGUIDData | null = null;

/**
 * Fetches the live AAGUID map, implementing the recommended precautions.
 */
export async function fetchAAGUIDs(): Promise<AAGUIDData> {
    if (cachedAAGUIDMap) return cachedAAGUIDMap;

    try {
        const response = await fetch(AAGUID_DATA_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch AAGUID data: ${response.statusText}`);
        }

        const data: AAGUIDData = await response.json();

        // Highly recommended check: Verify if the list has been officially retired
        if (Object.keys(data).length === 0) {
            console.warn("AAGUID list has been officially retired. Please notify the appropriate teams.");
            // You can add logic here to notify your error tracking service (e.g., Sentry)
            return {};
        }

        cachedAAGUIDMap = data;
        return data;
    } catch (error) {
        console.error("Error fetching AAGUIDs:", error);
        return {};
    }
}

/**
 * Returns a friendly name for a given AAGUID if known.
 */
export async function getAAGUIDName(aaguid?: string | null): Promise<string> {
    const aaguidMap = await fetchAAGUIDs();
    return getAAGUIDNameSync(aaguidMap, aaguid);
}

/**
 * Synchronous version of getAAGUIDName that requires the map to be provided.
 */
export function getAAGUIDNameSync(aaguidMap: AAGUIDData | null, aaguid?: string | null): string {
    if (!aaguid) return "Unknown";

    const normalized = aaguid.toLowerCase().replace(/[{}]/g, "");

    // Handle intentional unknown provider AAGUID
    if (normalized === "00000000-0000-0000-0000-000000000000") {
        return "Unknown";
    }

    if (!aaguidMap) return "Unknown";

    // Map the AAGUID to the provider name or return Unknown
    return aaguidMap[normalized]?.name || "Unknown";
}

interface NavigatorWithUAData extends Navigator {
    userAgentData?: {
        platform: string;
    };
}

/**
 * Generates a suggested name for a new passkey.
 * Prioritizes AAGUID since User-Agent strings do not reliably represent third-party passkey providers.
 */
export async function getSuggestedPasskeyName(userName?: string, aaguid?: string | null): Promise<string> {
    const aaguidMap = await fetchAAGUIDs();
    return getSuggestedPasskeyNameSync(aaguidMap, userName, aaguid);
}

/**
 * Synchronous version of getSuggestedPasskeyName that requires the map to be provided.
 */
export function getSuggestedPasskeyNameSync(aaguidMap: AAGUIDData | null, userName?: string, aaguid?: string | null): string {
    const firstName = userName?.split(" ")[0];

    // 1. Prioritize AAGUID for determining the actual passkey provider
    const providerName = getAAGUIDNameSync(aaguidMap, aaguid);

    if (providerName && providerName !== "Unknown") {
        return firstName ? `${firstName}'s ${providerName}` : providerName;
    }

    // 2. Fallback to User Agent parsing if AAGUID is unknown or not provided
    if (typeof window === "undefined") return "New Passkey";

    const nav = window.navigator as NavigatorWithUAData;
    const ua = nav.userAgent;
    const platform = nav.userAgentData?.platform || nav.platform;

    // Detect OS
    let os = "Device";
    if (/iPhone|iPad|iPod/.test(ua)) os = "iOS"; else if (/Android/.test(ua)) os = "Android"; else if (/Mac/.test(platform) || /Macintosh/.test(ua)) os = "macOS"; else if (/Win/.test(platform) || /Windows/.test(ua)) os = "Windows"; else if (/Linux/.test(platform) || /Linux/.test(ua)) os = "Linux";

    // Detect Browser
    let browser = "Browser";
    if (/Edg/.test(ua)) browser = "Edge"; else if (/Chrome/.test(ua)) browser = "Chrome"; else if (/Firefox/.test(ua)) browser = "Firefox"; else if (/Safari/.test(ua)) browser = "Safari";

    return firstName ? `${firstName}'s ${browser} on ${os}` : `${browser} on ${os}`;
}

/**
 * Checks if a WebAuthn error is one that should be handled silently (e.g., user cancellation).
 */
export function isSilentWebAuthnError(error: any): boolean {
    if (!error) return false;
    
    const name = (error.name || error.cause?.name || "").toLowerCase();
    const message = (error.message || "").toLowerCase();
    const causeMessage = (error.cause?.message || "").toLowerCase();

    return (
        name === "aborterror" ||
        name === "notallowederror" ||
        message.includes("abort") ||
        message.includes("timed out") ||
        message.includes("not allowed") ||
        message.includes("cancel") ||
        causeMessage.includes("abort") ||
        causeMessage.includes("timed out") ||
        causeMessage.includes("not allowed") ||
        causeMessage.includes("cancel")
    );
}
