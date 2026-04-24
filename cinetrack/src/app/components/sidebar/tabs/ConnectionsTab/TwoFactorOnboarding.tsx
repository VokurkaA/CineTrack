import {Button, Drawer, InputOTP, Label, Link} from "@heroui/react";
import QRCode from "react-qr-code";
import {Snippet} from "@/app/components/Snippet";
import React from "react";
import {useDictionary} from "@/app/components/DictionaryContext";

type TwoFactorOnboardingProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;

    onboardingStep: number;
    setOnboardingStep: (step: number) => void;

    totpURI: string;
    backupCodes: string[];
    isLoading: boolean;
    onVerifyTotp: (code: string) => Promise<void>;
    onClose: () => void;
}

export default function TwoFactorOnboarding({
                                                isOpen,
                                                setIsOpen,
                                                onboardingStep,
                                                setOnboardingStep,
                                                totpURI,
                                                backupCodes,
                                                isLoading,
                                                onVerifyTotp,
                                                onClose
                                            }: TwoFactorOnboardingProps) {
    const dictionary = useDictionary();
    const t = dictionary.sidebar.settings.connections.twoFactor;

    return (<Drawer>
        <Drawer.Backdrop variant='blur' isDismissable={false} isOpen={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Content className='max-w-4xl mx-auto'>
                <Drawer.Dialog>
                    <Drawer.Header>
                        <Drawer.Heading className='text-center my-4 font-bold text-xl'>
                            {t.drawerTitle}
                        </Drawer.Heading>
                    </Drawer.Header>
                    <Drawer.Body>
                        {onboardingStep === 0 && (<div className='flex flex-col items-center gap-6'>
                            <Label>{t.scanQr.label}</Label>
                            <QRCode
                                size={256}
                                value={totpURI}
                                viewBox='0 0 256 256'
                            />
                            <Label>{t.scanQr.link}</Label>
                            <Link
                                href={totpURI}
                                className='break-all text-sm'
                            >
                                {totpURI}
                            </Link>
                            <Button
                                fullWidth
                                onPress={() => setOnboardingStep(1)}
                            >
                                {t.verify.next}
                            </Button>
                        </div>)}
                        {onboardingStep === 1 && (<div className='flex flex-col gap-6'>
                            <InputOTP
                                maxLength={6}
                                variant='secondary'
                                className='w-min mx-auto'
                                onComplete={onVerifyTotp}
                            >
                                <InputOTP.Group>
                                    <InputOTP.Slot index={0}/>
                                    <InputOTP.Slot index={1}/>
                                    <InputOTP.Slot index={2}/>
                                </InputOTP.Group>
                                <InputOTP.Separator/>
                                <InputOTP.Group>
                                    <InputOTP.Slot index={3}/>
                                    <InputOTP.Slot index={4}/>
                                    <InputOTP.Slot index={5}/>
                                </InputOTP.Group>
                            </InputOTP>
                            <Button
                                onPress={() => setOnboardingStep(0)}
                                isDisabled={isLoading}
                                fullWidth
                            >
                                {t.verify.back}
                            </Button>
                        </div>)}
                        {onboardingStep === 2 && (<div className='flex flex-col gap-6'>
                            <Label>{t.backup.label}</Label>
                            <Snippet
                                className='w-min mx-auto'
                                variant='bordered'
                                color='default'
                                size='lg'
                            >
                                {backupCodes}
                            </Snippet>
                            <Button
                                fullWidth
                                onPress={onClose}
                            >
                                {t.backup.done}
                            </Button>
                        </div>)}
                    </Drawer.Body>
                    <Drawer.Footer/>
                </Drawer.Dialog>
            </Drawer.Content>
        </Drawer.Backdrop>
    </Drawer>)
}
