import {Button, EmptyState, Spinner, Table, toast} from "@heroui/react";
import {PasskeyIcon} from "@/app/components/icons";
import {PencilSquareIcon, PlusIcon, TrashIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useMemo, useState} from "react";
import {useDictionary} from "@/app/components/DictionaryContext";
import {InputModal} from "@/app/components/InputModal";
import {usePasskeys} from "@/hooks/usePasskeys";
import {authClient} from "@/lib/auth-client";
import {AAGUIDData, fetchAAGUIDs, getAAGUIDNameSync, getSuggestedPasskeyNameSync, isSilentWebAuthnError} from "@/lib/passkey";
import {useAlertDialog} from "@/app/components/AlertDialogProvider";

type ActivePasskey = { id: string; name: string };

type PasskeysProps = ReturnType<typeof usePasskeys>;

export default function Passkeys({passkeys, isLoading, add, rename, remove}: PasskeysProps) {
    const dictionary = useDictionary();
    const alert = useAlertDialog();
    const {data: session} = authClient.useSession();
    const t = dictionary.sidebar.settings.connections.passkey;

    const [aaguidMap, setAaguidMap] = useState<AAGUIDData | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [activePasskey, setActivePasskey] = useState<ActivePasskey | null>(null);

    useEffect(() => {
        fetchAAGUIDs().then(setAaguidMap);
    }, []);

    const suggestedName = useMemo(() => {
        return getSuggestedPasskeyNameSync(aaguidMap, session?.user?.name);
    }, [aaguidMap, session?.user?.name]);


    const openRename = (passkey: ActivePasskey) => {
        setActivePasskey(passkey);
        setIsRenameModalOpen(true);
    };

    const openDelete = (passkey: ActivePasskey) => {
        alert.show({
            title: t.deleteTitle,
            body: passkeys.length === 1 ? t.deleteLastWarning : t.deleteDescription,
            status: "danger",
            confirmLabel: dictionary.common.deleteConfirm,
            cancelLabel: dictionary.common.cancel,
            onConfirm: async () => {
                const error = await remove(passkey.id);
                if (error) toast.danger(error.message);
            }
        });
    };

    return (<>
        <Table variant='secondary'>
            <Table.ScrollContainer>
                <Table.Content aria-label={t.title}>
                    <Table.Header>
                        <Table.Column id="name" isRowHeader>{t.columnName}</Table.Column>
                        <Table.Column id="provider">{t.columnProvider}</Table.Column>
                        <Table.Column id="device">{t.columnDeviceType}</Table.Column>
                        <Table.Column id="added">{t.columnAdded}</Table.Column>
                        <Table.Column id="actions" className="text-end">{t.columnActions}</Table.Column>
                    </Table.Header>
                    <Table.Body
                        renderEmptyState={() => !isLoading && (
                            <EmptyState className="flex flex-col items-center justify-center gap-2 py-8">
                                <PasskeyIcon className="text-muted size-6"/>
                                <span className="text-sm text-muted">{t.emptyState}</span>
                            </EmptyState>)}
                    >
                        <Table.Collection items={passkeys}>
                            {(passkey) => {
                                const providerName = getAAGUIDNameSync(aaguidMap, passkey.aaguid);
                                const displayName = passkey.name || passkey.credentialID.slice(0, 8);

                                return (<Table.Row id={passkey.id}>
                                    <Table.Cell className="font-medium">
                                        {displayName}
                                    </Table.Cell>
                                    <Table.Cell className="text-muted-foreground">
                                        {providerName}
                                    </Table.Cell>
                                    <Table.Cell className="capitalize">
                                        {passkey.deviceType}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {passkey.createdAt ? new Date(passkey.createdAt).toLocaleDateString() : '—'}
                                    </Table.Cell>
                                    <Table.Cell className="text-end">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="tertiary"
                                                onPress={() => openRename({id: passkey.id, name: passkey.name ?? ''})}
                                            >
                                                <PencilSquareIcon className="size-4"/>
                                            </Button>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="danger-soft"
                                                onPress={() => openDelete({id: passkey.id, name: displayName})}
                                            >
                                                <TrashIcon className="size-4"/>
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>)
                            }}
                        </Table.Collection>
                        {isLoading && (
                            <Table.LoadMore>
                                <Table.LoadMoreContent className="py-8">
                                    <Spinner size="md" color="accent" />
                                </Table.LoadMoreContent>
                            </Table.LoadMore>
                        )}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
            <Table.Footer>
                <Button className='ml-auto' size="sm" variant="secondary" onPress={() => setIsAddModalOpen(true)}>
                    <PlusIcon className="size-4"/>
                    {dictionary.common.add}
                </Button>
            </Table.Footer>
        </Table>

        <InputModal
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            onSubmit={async (e) => {
                e.preventDefault();
                const name = (new FormData(e.currentTarget).get("name") as string | null)?.trim();
                try {
                    const {data, error} = await add(name || undefined);
                    if (!error && data) {
                        const newSuggestedName = getSuggestedPasskeyNameSync(aaguidMap, session?.user?.name, (data as { aaguid?: string }).aaguid);
                        if (newSuggestedName !== suggestedName && (!name || name === suggestedName)) {
                            await rename(data.id, newSuggestedName);
                        }
                        setIsAddModalOpen(false);
                    } else if (error) {
                        if (!isSilentWebAuthnError(error)) {
                            toast.danger(error.message);
                        }
                    }
                } catch (err) {
                    if (!isSilentWebAuthnError(err)) {
                        toast.danger((err as Error).message || dictionary.common.unknownError);
                    }
                }
            }}
            heading={t.addTitle}
            label={t.addLabel}
            modalLabel={t.addLabel}
            placeholder={t.addPlaceholder}
            defaultValue={suggestedName}
            name="name"
            type="text"
        />

        <InputModal
            isOpen={isRenameModalOpen}
            onOpenChange={setIsRenameModalOpen}
            onSubmit={async (e) => {
                e.preventDefault();
                const name = (new FormData(e.currentTarget).get("name") as string | null)?.trim();
                if (!name || !activePasskey) return;
                const error = await rename(activePasskey.id, name);
                if (!error) {
                    setIsRenameModalOpen(false);
                    setActivePasskey(null);
                } else toast.danger(error.message);
            }}
            heading={t.renameTitle}
            label={t.renameLabel}
            modalLabel={t.renameLabel}
            placeholder={activePasskey?.name}
            name="name"
            type="text"
        />
    </>);
}