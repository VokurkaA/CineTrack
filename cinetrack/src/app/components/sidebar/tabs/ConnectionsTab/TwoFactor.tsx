import {Switch, toast} from "@heroui/react";
import {ListGroup} from "@/app/components/list-group";
import {LockClosedIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import {useDictionary} from "@/app/components/DictionaryContext";
import {InputModal} from "@/app/components/InputModal";
import TwoFactorOnboarding from "@/app/components/sidebar/tabs/ConnectionsTab/TwoFactorOnboarding";
import {useTwoFactor} from "@/hooks/useTwoFactor";
import {useAlertDialog} from "@/app/components/AlertDialogProvider";

type TwoFactorProps = {
    isEnabled: boolean; lastLoginMethod?: string | undefined | null;
}

export default function TwoFactor({lastLoginMethod, isEnabled}: TwoFactorProps) {
    const dictionary = useDictionary();
    const alert = useAlertDialog();
    const t = dictionary.sidebar.settings.connections.twoFactor;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [totpURI, setTotpURI] = useState("");
    const [backupCodes, setBackupCodes] = useState<string[]>([]);

    const {isLoading, toggle, regenerateCodes, verifyTotp, resolvePassword} = useTwoFactor({
        lastLoginMethod, onNeedsPassword: () => setIsModalOpen(true), onEnableSuccess: (uri, codes) => {
            setTotpURI(uri);
            setBackupCodes(codes);
            setIsDrawerOpen(true);
        }, onDisableSuccess: () => {
            setIsModalOpen(false);
            toast.success(t.toast.disabled);
        }, onRegenerateSuccess: (codes) => {
            setBackupCodes(codes);
            setOnboardingStep(2);
            setIsDrawerOpen(true);
        },
    });

    const handleCloseOnboarding = () => {
        setIsDrawerOpen(false);
        setOnboardingStep(0);
        setTotpURI("");
        setBackupCodes([]);
    };

    const handleToggle = () => {
        if (isEnabled) {
            alert.show({
                title: t.disableConfirmTitle,
                body: t.disableConfirmDescription,
                status: "danger",
                confirmLabel: t.disable,
                cancelLabel: dictionary.common.cancel,
                onConfirm: () => toggle(true)
            });
        } else {
            toggle(false);
        }
    };

    const handleRegenerate = () => {
        alert.show({
            title: t.regenerateConfirmTitle,
            body: t.regenerateConfirmDescription,
            status: "warning",
            confirmLabel: t.regenerate,
            cancelLabel: dictionary.common.cancel,
            onConfirm: regenerateCodes
        });
    };

    return (<>
        <ListGroup variant='transparent'>
            <ListGroup.Item onPress={handleToggle}>
                <ListGroup.ItemPrefix>
                    <LockClosedIcon className='text-foreground size-6'/>
                </ListGroup.ItemPrefix>
                <ListGroup.ItemContent>
                    <ListGroup.ItemTitle>{isEnabled ? t.statusEnabled : t.statusDisabled}</ListGroup.ItemTitle>
                    <ListGroup.ItemDescription>{t.description}</ListGroup.ItemDescription>
                </ListGroup.ItemContent>
                <ListGroup.ItemSuffix>
                    <Switch isSelected={isEnabled}>
                        <Switch.Control>
                            <Switch.Thumb/>
                        </Switch.Control>
                    </Switch>
                </ListGroup.ItemSuffix>
            </ListGroup.Item>
            <ListGroup.Item disabled={!isEnabled} onPress={handleRegenerate}>
                <ListGroup.ItemContent>
                    <ListGroup.ItemTitle>{t.regenerate}</ListGroup.ItemTitle>
                    <ListGroup.ItemDescription>{t.regenerateDescription}</ListGroup.ItemDescription>
                </ListGroup.ItemContent>
                <ListGroup.ItemSuffix/>
            </ListGroup.Item>
        </ListGroup>

        <TwoFactorOnboarding
            isOpen={isDrawerOpen}
            setIsOpen={setIsDrawerOpen}
            onboardingStep={onboardingStep}
            setOnboardingStep={setOnboardingStep}
            totpURI={totpURI}
            backupCodes={backupCodes}
            isLoading={isLoading}
            onVerifyTotp={verifyTotp}
            onClose={handleCloseOnboarding}
        />

        <InputModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            onSubmit={async (e) => {
                e.preventDefault();
                const password = (new FormData(e.currentTarget).get("password") as string | null)?.trim();
                if (!password) return;
                resolvePassword(password);
            }}
            heading={t.modalTitle}
            label={t.modalLabel}
            modalLabel={t.modalLabel}
            placeholder={t.modalPlaceholder}
            name='password'
            type='password'
        />
    </>);
}