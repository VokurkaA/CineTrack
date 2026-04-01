"use client";

import { useState } from "react";
import {
  Button,
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Description,
  Card,
  toast,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDictionary } from "@/app/components/DictionaryContext";
import { authClient } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";

export default function LoginPage() {
  const dictionary = useDictionary();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const { error: authError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      const errorCode = authError.code || authError.statusText;
      const errorMessage = dictionary.authErrors[errorCode as keyof typeof dictionary.authErrors] || dictionary.authErrors.UNKNOWN_ERROR;
      console.log(authError)
      toast(dictionary.login.error, {
        variant: "danger",
        description: errorMessage
      })
      setLoading(false);
    } else {
      router.push(`/${lang}/`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background">
      <Card variant="transparent">
        <Card.Header>
          <Card.Title>
            {dictionary.login.title}
          </Card.Title>
          <Card.Description>
            {dictionary.login.description}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Form className="flex w-96 flex-col gap-4" onSubmit={onSubmit}>
            <TextField
              isRequired
              name="email"
              type="email"
              validate={(value) => {
                if (!value) {
                  return dictionary.login.emailRequired;
                }
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return dictionary.login.emailInvalid;
                }
                return null;
              }}
            >
              <Label>{dictionary.login.email}</Label>
              <Input placeholder={dictionary.login.emailPlaceholder} variant="secondary" />
              <FieldError />
            </TextField>

            <TextField
              isRequired
              name="password"
              type="password"
              validate={(value) => {
                if (!value) {
                  return dictionary.login.passwordRequired;
                }
                if (value.length < 8) {
                  return dictionary.login.passwordTooShort;
                }
                return null;
              }}
            >
              <Label>{dictionary.login.password}</Label>
              <Input placeholder={dictionary.login.passwordPlaceholder} variant="secondary" />
              <Description>
                {dictionary.login.passwordDescription}
              </Description>
              <FieldError />
            </TextField>

            <Button type="submit" variant="primary" isPending={loading} fullWidth>
              <Icon icon="lucide:log-in" />
              {dictionary.login.signIn}
            </Button>

            <Link href={`/${lang}/register`} className="no-underline space-x-1">
              <span>{dictionary.login.noAccount}</span>
              <span className="underline font-bold">{dictionary.login.signUp}</span>
            </Link>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
