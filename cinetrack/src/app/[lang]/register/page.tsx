"use client";

import {useEffect, useState} from "react";
import {Button, Card, Description, FieldError, Form, InputGroup, Label, TextField, toast,} from "@heroui/react";
import {useDictionary} from "@/app/components/DictionaryContext";
import {authClient} from "@/lib/auth-client";
import {EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon} from "@heroicons/react/24/outline";
import {useLocaleRouter} from "@/hooks/useLocaleRouter";
import {LocaleLink} from "@/app/components/LocaleLink";

export default function RegisterPage() {
    const dictionary = useDictionary();
    const router = useLocaleRouter();

    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

        const {error: authError} = await authClient.signUp.email({
            email: data.email, password: data.password, name: data.name,
        });

        if (authError) {
            if (process.env.NODE_ENV === "development") {
                console.log("[RegisterPage] auth error:", authError);
            }

            toast(authError.message || dictionary.common.unknownError, {variant: "danger"});
            setLoading(false);
        } else {
            setLoading(false);
            router.push(`/`);
            router.refresh();
        }
    };

    useEffect(() => {
        authClient.oneTap({
            fetchOptions: {
                onSuccess: async () => {
                    await authClient.getSession();

                    router.push("/");
                    router.refresh();
                }, onError: (ctx) => {
                    console.error("[OneTap Error]", ctx.error);
                }
            },
        });
    }, [router]);

    return (<main className="min-h-svh w-full flex flex-col items-center justify-center bg-background">
        <Card className="my-auto w-96" variant="transparent">
            <Card.Header className="text-center mb-4">
                <Card.Title className="mb-2 text-3xl font-bold">
                    {dictionary.register.title}
                </Card.Title>
                <Card.Description>
                    {dictionary.register.description}
                </Card.Description>
            </Card.Header>

            <Card.Content>
                <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <TextField
                        isRequired
                        name="name"
                        type="text"
                        autoComplete="name"
                        validate={(value) => {
                            if (!value) return dictionary.register.nameRequired;
                            return null;
                        }}
                    >
                        <Label>{dictionary.register.name}</Label>
                        <InputGroup>
                            <InputGroup.Prefix>
                                <UserIcon className="size-4 text-foreground"/>
                            </InputGroup.Prefix>
                            <InputGroup.Input placeholder={dictionary.register.namePlaceholder}/>
                        </InputGroup>
                        <FieldError/>
                    </TextField>

                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        validate={(value) => {
                            if (!value) return dictionary.login.emailRequired;
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return dictionary.login.emailInvalid;
                            return null;
                        }}
                    >
                        <Label>{dictionary.login.email}</Label>
                        <InputGroup>
                            <InputGroup.Prefix>
                                <EnvelopeIcon className="size-4 text-foreground"/>
                            </InputGroup.Prefix>
                            <InputGroup.Input placeholder={dictionary.login.emailPlaceholder}/>
                        </InputGroup>
                        <FieldError/>
                    </TextField>

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
                        <Label>{dictionary.login.password}</Label>
                        <InputGroup>
                            <InputGroup.Prefix>
                                <LockClosedIcon className="size-4 text-foreground"/>
                            </InputGroup.Prefix>
                            <InputGroup.Input placeholder={dictionary.login.passwordPlaceholder}/>
                            {password && <InputGroup.Suffix>
                                <Button
                                    variant="ghost"
                                    aria-label={showPassword ? dictionary.login.hidePassword : dictionary.login.showPassword}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeIcon className="size-4 text-foreground"/> :
                                        <EyeSlashIcon className="size-4 text-foreground"/>}
                                </Button>
                            </InputGroup.Suffix>}
                        </InputGroup>
                        <Description>{dictionary.login.passwordDescription}</Description>
                        <FieldError/>
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
                        <Label>{dictionary.register.confirmPassword}</Label>
                        <InputGroup>
                            <InputGroup.Prefix>
                                <LockClosedIcon className="size-4 text-foreground"/>
                            </InputGroup.Prefix>
                            <InputGroup.Input placeholder={dictionary.register.confirmPasswordPlaceholder}/>
                            {confirmPassword && (<InputGroup.Suffix>
                                <Button
                                    variant="ghost"
                                    aria-label={showConfirmPassword ? dictionary.login.hidePassword : dictionary.login.showPassword}
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? <EyeIcon className="size-4 text-foreground"/> :
                                        <EyeSlashIcon className="size-4 text-foreground"/>}
                                </Button>
                            </InputGroup.Suffix>)}
                        </InputGroup>
                        <FieldError/>
                    </TextField>

                    <Button type="submit" variant="primary" isPending={loading} fullWidth>
                        {dictionary.register.signUp}
                    </Button>
                </Form>
            </Card.Content>
        </Card>

        <LocaleLink href={`/login`} aria-label={`${dictionary.register.hasAccount} ${dictionary.register.signIn}`} className="no-underline space-x-1 m-4">
            <span>{dictionary.register.hasAccount}</span>
            <span className="underline font-bold">{dictionary.register.signIn}</span>
        </LocaleLink>
    </main>);
}