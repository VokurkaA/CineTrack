"use client";

import {useState} from "react";
import {Button, Card, Form, InputGroup, InputOTP, Label, TextField, toast} from "@heroui/react";
import {useDictionary} from "@/app/components/DictionaryContext";
import {authClient} from "@/lib/auth-client";
import {useLocaleRouter} from "@/hooks/useLocaleRouter";
import {LockClosedIcon} from "@heroicons/react/24/outline";

export default function TwoFactorPage() {
    const dictionary = useDictionary();
    const t = dictionary.twoFactorLogin;
    const router = useLocaleRouter();

    const [loading, setLoading] = useState(false);
    const [isBackup, setIsBackup] = useState(false);
    const [code, setCode] = useState("");
    const [backupCode, setBackupCode] = useState("");

    const onVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            if (isBackup) {
                await authClient.twoFactor.verifyBackupCode({
                    code: backupCode, fetchOptions: {
                        onSuccess: () => {
                            router.push("/");
                            router.refresh();
                        }, onError: (ctx) => {
                            toast(t.invalidCode, {
                                variant: "danger", description: ctx.error.message || dictionary.common.unknownError,
                            });
                        },
                    },
                });
            } else {
                await authClient.twoFactor.verifyTotp({
                    code, fetchOptions: {
                        onSuccess: () => {
                            router.push("/");
                            router.refresh();
                        }, onError: (ctx) => {
                            toast(t.invalidCode, {
                                variant: "danger", description: ctx.error.message || dictionary.common.unknownError,
                            });
                        },
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (<main className="min-h-svh w-full flex flex-col items-center justify-center bg-background">
        <Card className="my-auto w-96" variant="transparent">
            <Card.Header className="text-center mb-4">
                <Card.Title className="mb-2 text-3xl font-bold">
                    {t.title}
                </Card.Title>
                <Card.Description>
                    {t.description}
                </Card.Description>
            </Card.Header>

            <Card.Content>
                <Form className="flex flex-col gap-6" onSubmit={onVerify}>
                    {!isBackup ? (<div className="flex flex-col gap-4">
                        <Label className="text-center">{t.totpLabel}</Label>
                        <InputOTP
                            maxLength={6}
                            variant="secondary"
                            className="w-min mx-auto"
                            value={code}
                            onChange={setCode}
                            onComplete={() => onVerify()}
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
                    </div>) : (<TextField
                        isRequired
                        name="backupCode"
                        value={backupCode}
                        onChange={setBackupCode}
                        autoComplete="one-time-code"
                    >
                        <Label>{t.backupLabel}</Label>
                        <InputGroup>
                            <InputGroup.Prefix>
                                <LockClosedIcon className="size-4 text-foreground"/>
                            </InputGroup.Prefix>
                            <InputGroup.Input
                                placeholder={t.backupPlaceholder}
                                value={backupCode}
                            />
                        </InputGroup>
                    </TextField>)}

                    <div className="flex flex-col gap-2">
                        <Button
                            type="submit"
                            variant="primary"
                            isPending={loading}
                            isDisabled={loading || (!isBackup && code.length < 6) || (isBackup && !backupCode)}
                            fullWidth
                        >
                            {t.verify}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onPress={() => setIsBackup(!isBackup)}
                            fullWidth
                        >
                            {isBackup ? t.useTotp : t.useBackupCode}
                        </Button>
                    </div>
                </Form>
            </Card.Content>
        </Card>
    </main>);
}
