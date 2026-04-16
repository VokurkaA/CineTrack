"use client";

import { useDictionary } from "@/app/components/DictionaryContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { authClient } from "@/lib/auth-client";
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { TextField, Label, InputGroup, FieldError, Card, Form, Button, toast } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SetPasswordPage() {
    const dictionary = useDictionary();
    const router = useLocaleRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token") ?? undefined;
    const error = searchParams.get("error") ?? undefined;

    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!token && !error) {
            router.replace(`/reset-password`);
        }
    }, [token, error, router]);

    if (error === "INVALID_TOKEN") {
        return (
            <main className="min-h-svh w-full flex flex-col items-center justify-center bg-background">
                <Card className="my-auto w-96" variant="transparent">
                    <Card.Header>
                        <Card.Title className="mb-4 text-3xl font-bold">
                            {dictionary.setPassword.expiredTitle}
                        </Card.Title>
                        <Card.Description>
                            {dictionary.setPassword.expiredDescription}
                        </Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <Button
                            variant="primary"
                            fullWidth
                            onPress={() => router.push(`/reset-password`)}
                        >
                            {dictionary.setPassword.requestNewLink}
                        </Button>
                    </Card.Content>
                </Card>
            </main>
        );
    }

    if (!token && !error) return null;

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const { error: authError } = await authClient.resetPassword({
            newPassword: password,
            token,
        });

        if (authError) {
            toast(authError.message || dictionary.setPassword.error, { variant: "danger" });
            setLoading(false);
        } else {
            toast(dictionary.setPassword.success, { variant: "success" });
            router.push(`/login`);
        }
    };

    return (
        <main className="min-h-svh w-full flex flex-col items-center justify-center bg-background">
            <Card className="my-auto w-96" variant="transparent">
                <Card.Header className="text-center mb-4">
                    <Card.Title className="mb-2 text-3xl font-bold">
                        {dictionary.setPassword.title}
                    </Card.Title>
                    <Card.Description>
                        {dictionary.setPassword.description}
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                        <TextField
                            isRequired
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={setPassword}
                            autoComplete="new-password"
                            validate={(value) => {
                                if (!value) return dictionary.login.passwordRequired;
                                if (value.length < 8) return dictionary.login.passwordTooShort;
                                return null;
                            }}
                        >
                            <Label>{dictionary.setPassword.newPassword}</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <LockClosedIcon className="size-4 text-foreground" />
                                </InputGroup.Prefix>
                                <InputGroup.Input placeholder={dictionary.setPassword.newPasswordPlaceholder} />
                                {password && (
                                    <InputGroup.Suffix>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            aria-label={showPassword ? dictionary.login.hidePassword : dictionary.login.showPassword}
                                            onPress={() => setShowPassword((p) => !p)}
                                        >
                                            {showPassword
                                                ? <EyeIcon className="size-4 text-foreground" />
                                                : <EyeSlashIcon className="size-4 text-foreground" />}
                                        </Button>
                                    </InputGroup.Suffix>
                                )}
                            </InputGroup>
                            <FieldError />
                        </TextField>

                        <TextField
                            isRequired
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            autoComplete="new-password"
                            validate={(value) => {
                                if (!value) return dictionary.register.confirmPasswordRequired;
                                if (value !== password) return dictionary.register.passwordsDoNotMatch;
                                return null;
                            }}
                        >
                            <Label>{dictionary.setPassword.confirmPassword}</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <LockClosedIcon className="size-4 text-foreground" />
                                </InputGroup.Prefix>
                                <InputGroup.Input placeholder={dictionary.setPassword.confirmPasswordPlaceholder} />
                                {confirmPassword && (
                                    <InputGroup.Suffix>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            aria-label={showConfirmPassword ? dictionary.login.hidePassword : dictionary.login.showPassword}
                                            onPress={() => setShowConfirmPassword((p) => !p)}
                                        >
                                            {showConfirmPassword
                                                ? <EyeIcon className="size-4 text-foreground" />
                                                : <EyeSlashIcon className="size-4 text-foreground" />}
                                        </Button>
                                    </InputGroup.Suffix>
                                )}
                            </InputGroup>
                            <FieldError />
                        </TextField>

                        <Button
                            type="submit"
                            variant="primary"
                            isPending={loading}
                            isDisabled={!password || !confirmPassword || password !== confirmPassword}
                            fullWidth
                        >
                            {dictionary.setPassword.submit}
                        </Button>
                    </Form>
                </Card.Content>
            </Card>
        </main>
    );
}