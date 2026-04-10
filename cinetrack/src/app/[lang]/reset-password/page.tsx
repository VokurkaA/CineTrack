"use client";

import { useDictionary } from "@/app/components/DictionaryContext";
import { authClient } from "@/lib/auth-client";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { TextField, Label, InputGroup, FieldError, Card, Form, Button, toast } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
    const dictionary = useDictionary();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const params = useParams();
    const lang = Array.isArray(params.lang) ? params.lang[0] : (params.lang ?? "en");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

        await authClient.requestPasswordReset({
            email: data.email,
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/${lang}/set-password`,
        });

        toast(dictionary.resetPassword.checkEmail, { variant: "success" });
        setLoading(false);
    };

    return (
        <main className="min-h-svh w-full flex flex-col items-center justify-center bg-background">
            <Card className="my-auto w-96" variant="transparent">
                <Card.Header className="text-center mb-4">
                    <Card.Title className="mb-2 text-3xl font-bold">
                        {dictionary.resetPassword.title}
                    </Card.Title>
                    <Card.Description>
                        {dictionary.resetPassword.description}
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            validate={(value) => {
                                if (!value) return dictionary.resetPassword.emailRequired;
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
                                    return dictionary.resetPassword.emailInvalid;
                                return null;
                            }}
                        >
                            <Label>{dictionary.resetPassword.email}</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <EnvelopeIcon className="size-4 text-foreground" />
                                </InputGroup.Prefix>
                                <InputGroup.Input placeholder={dictionary.resetPassword.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </InputGroup>
                            <FieldError />
                        </TextField>
                        <Button isDisabled={loading || !email} type="submit" variant="primary" isPending={loading} fullWidth>
                            {dictionary.resetPassword.submit}
                        </Button>
                    </Form>
                </Card.Content>
            </Card>
        </main>
    );
}