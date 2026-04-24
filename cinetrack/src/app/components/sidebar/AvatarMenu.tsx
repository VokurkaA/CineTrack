import {authClient} from "@/lib/auth-client";
import {ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {Avatar, Button, Modal, Separator, Tabs} from "@heroui/react";
import React from "react";
import {useDictionary} from "../DictionaryContext";
import {ConnectionsTab} from "./tabs/ConnectionsTab/ConnectionsTab";
import {GeneralTab} from "./tabs/GeneralTab";
import {usePasskeys} from "@/hooks/usePasskeys";

export function AvatarMenu({session}: { session?: ReturnType<typeof authClient.useSession>["data"] }) {
    const dictionary = useDictionary();
    const [selectedTab, setSelectedTab] = React.useState<"general" | "connections">('general')
    const passkeyHooks = usePasskeys();

    return (<Modal>
        <Modal.Trigger>
            <Button
                variant="ghost"
                className="relative group p-0 text-left flex h-12 w-full items-center justify-start gap-3 rounded-xl hover:bg-surface-secondary px-2"
            >
                <Avatar size="sm" className="bg-transparent border border-border">
                    {session?.user?.image ? (<Avatar.Image
                        alt={session?.user?.name || "Avatar"}
                        src={session?.user?.image || ""}
                        referrerPolicy="no-referrer"
                    />) : (<Avatar.Fallback className="bg-transparent">
                        {session?.user?.name?.[0] || "?"}
                    </Avatar.Fallback>)}
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                        <span
                            className="text-sm font-semibold truncate">{session?.user?.name || dictionary.sidebar.settings.common.placeholder}</span>
                    <span className="text-xs text-muted truncate">{session?.user?.email}</span>
                </div>
                <ChevronUpDownIcon
                    className="text-muted size-4 m-0 top-1 right-1 absolute hidden group-hover:block"/>
            </Button>
        </Modal.Trigger>
        <Modal.Backdrop variant="opaque">
            <Modal.Container placement="top">
                <Modal.Dialog aria-label={dictionary.sidebar.settings.common.placeholder} className='min-h-96 w-full max-w-2xl'>
                    <Modal.CloseTrigger aria-label={dictionary.common.close}/>
                    <Modal.Body className="flex flex-col gap-2">
                        <Tabs orientation="vertical"
                              onSelectionChange={(key) => setSelectedTab(key as "general" | "connections")}
                              selectedKey={selectedTab}
                              className='max-w-full h-full overflow-x-clip'
                        >
                            <Tabs.ListContainer>
                                <Tabs.List className='h-full bg-surface'>
                                    <Tabs.Tab id='general'>
                                        {dictionary.sidebar.settings.general.title}
                                        <Tabs.Indicator/>
                                    </Tabs.Tab>
                                    <Tabs.Tab id='connections'>
                                        {dictionary.sidebar.settings.connections.title}
                                        <Tabs.Indicator/>
                                    </Tabs.Tab>
                                </Tabs.List>
                            </Tabs.ListContainer>
                            <Separator orientation='vertical' />
                            <Tabs.Panel id='general'>
                                <GeneralTab session={session}/>
                            </Tabs.Panel>
                            <Tabs.Panel id='connections'>
                                <ConnectionsTab session={session} passkeyHooks={passkeyHooks}/>
                            </Tabs.Panel>
                        </Tabs>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>)
}