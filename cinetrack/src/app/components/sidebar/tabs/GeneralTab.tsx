import {authClient} from "@/lib/auth-client";
import {ComputerDesktopIcon, MoonIcon, PencilIcon, SunIcon} from "@heroicons/react/24/outline";
import {
    Avatar,
    Button,
    Chip,
    Description,
    Key,
    Label,
    ListBox,
    Modal,
    Popover,
    ToggleButton,
    ToggleButtonGroup
} from "@heroui/react";
import {useTheme} from "next-themes";
import React from "react";
import {useDictionary} from "../../DictionaryContext";
import {InputModal} from "../../InputModal";

export const GeneralTab = ({session}: { session?: ReturnType<typeof authClient.useSession>["data"] }) => {
    const dictionary = useDictionary();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    type ThemeOption = "system" | "dark" | "light";
    const {setTheme, theme, forcedTheme} = useTheme();

    const userRole = session?.user.role;
    const [selectedTheme, setSelectedTheme] = React.useState<ThemeOption>(forcedTheme ? (forcedTheme as ThemeOption) : (theme as ThemeOption) ?? "system");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const image = formData.get("image") as string;
        if (image) {
            await authClient.updateUser({image});
            setIsModalOpen(false);
        }
    }

    React.useEffect(() => {
        if (forcedTheme) {
            setSelectedTheme(forcedTheme as ThemeOption);
        } else if (theme) {
            setSelectedTheme(theme as ThemeOption);
        }
    }, [theme, forcedTheme]);

    const handleThemeChange = (keys: Set<Key>) => {
        const selected = [...keys][0] as ThemeOption;
        if (!selected) return;
        setSelectedTheme(selected);
        setTheme(selected);
    };

    return (<div className='flex flex-col gap-4'>
        <Modal.Heading>{dictionary.sidebar.settings.general.title}</Modal.Heading>
        <Avatar className="group size-20 mx-auto my-4">
            <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Popover.Trigger>
                    <Button variant='ghost'
                            isIconOnly
                            className="absolute z-50 inset-0 h-full w-full scale-110 flex items-center justify-center rounded-full bg-background/50 opacity-0 transition-opacity
                                        group-hover:opacity-100 group-hover:cursor-pointer"
                            aria-label={dictionary.sidebar.settings.general.editAvatar}
                    >
                        <PencilIcon className="text-foreground size-6"/>
                    </Button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Dialog aria-label={dictionary.sidebar.settings.general.editAvatar}>
                        <ListBox
                            aria-label={dictionary.sidebar.settings.general.editAvatar}
                            onAction={(key) => {
                                setIsPopoverOpen(false);
                                if (key === 'remove') authClient.updateUser({image: ''});
                                if (key === 'upload') setIsModalOpen(true);
                            }}
                        >
                            {session?.user.image &&
                                <ListBox.Item id="remove" textValue={dictionary.sidebar.settings.general.removeAvatar}>
                                    <Label>{dictionary.sidebar.settings.general.removeAvatar}</Label>
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>}
                            <ListBox.Item id="upload" textValue={dictionary.sidebar.settings.general.uploadAvatar}>
                                <Label>{dictionary.sidebar.settings.general.uploadAvatar}</Label>
                                <ListBox.ItemIndicator/>
                            </ListBox.Item>
                        </ListBox>
                    </Popover.Dialog>
                </Popover.Content>
            </Popover>

            <InputModal isOpen={isModalOpen}
                        onOpenChange={setIsModalOpen}
                        onSubmit={handleSubmit}
                        heading={dictionary.sidebar.settings.general.uploadAvatar}
                        label={dictionary.sidebar.settings.general.avatarUrl}
                        modalLabel={dictionary.sidebar.settings.general.uploadAvatar}
                        name="image"
                        type="url"
                        placeholder={dictionary.sidebar.settings.general.avatarUrlPlaceholder}
                        submitLabel={dictionary.sidebar.settings.general.saveAvatar}
                        validateTextField={(value) => {
                            if (!value) return true;
                            const regex = /^https?:\/\/\S+$/i;
                            if (!regex.test(value)) {
                                return dictionary.sidebar.settings.general.invalidUrl;
                            }
                            return true;
                        }}
            />

            {session?.user?.image ? (<Avatar.Image
                alt={session?.user?.name || "Avatar"}
                src={session?.user?.image || ""}
                referrerPolicy="no-referrer"
            />) : (<Avatar.Fallback className="size-6">
                {session?.user?.name?.[0] || "?"}
            </Avatar.Fallback>)}
        </Avatar>
        <div className='flex flex-col gap-2'>
            <div className='flex flex-row justify-between w-full'>
                <Label>{session?.user?.name || dictionary.sidebar.settings.common.user}</Label>
                <Chip className="w-min" variant="soft"
                      color={userRole === 'admin' ? 'warning' : 'accent'}>
                    {userRole}
                </Chip>
            </div>
            <Description>{session?.user.createdAt && session.user.createdAt.toLocaleDateString()}</Description>
            <Description>{session?.user.email}</Description>
        </div>
        <ToggleButtonGroup
            size="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([selectedTheme])}
            onSelectionChange={handleThemeChange}
            isDisabled={!!forcedTheme}
            aria-label={dictionary.sidebar.settings.common.placeholder}
        >
            <ToggleButton id="system" aria-label={dictionary.sidebar.theme.system}>
                <ComputerDesktopIcon className="size-4 text-foreground"/>
            </ToggleButton>
            <ToggleButton id="dark" aria-label={dictionary.sidebar.theme.dark}>
                <ToggleButtonGroup.Separator/>
                <MoonIcon className="size-4 text-foreground"/>
            </ToggleButton>
            <ToggleButton id="light" aria-label={dictionary.sidebar.theme.light}>
                <ToggleButtonGroup.Separator/>
                <SunIcon className="size-4 text-foreground"/>
            </ToggleButton>
        </ToggleButtonGroup>
        <Button
            variant="danger-soft"
            className="mt-4"
            onPress={async () => {
                await authClient.signOut();
            }}
            fullWidth
        >
            {dictionary.sidebar.settings.common.signOut}
        </Button>
    </div>)
}