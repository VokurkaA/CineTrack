"use client";

import { useState } from "react";
import {
  Button,
  Form,
  TextField,
  Label,
  FieldError,
  Card,
  toast,
  Link,
  InputGroup,
  Separator,
} from "@heroui/react";
import { useDictionary } from "@/app/components/DictionaryContext";
import { authClient } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FacebookIcon, GithubIcon, GoogleIcon } from "@/app/components/icons";

type SocialProvider = "Google" | "Github" | "Facebook";

const SOCIAL_PROVIDERS: { provider: SocialProvider; icon: React.ReactNode }[] = [
  { provider: "Google", icon: <GoogleIcon /> },
  { provider: "Github", icon: <GithubIcon /> },
  { provider: "Facebook", icon: <FacebookIcon /> },
];


export default function LoginPage() {
  const dictionary = useDictionary();
  const router = useRouter();
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : (params.lang ?? "en");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    const { error: authError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      const errorCode = authError.code ?? "UNKNOWN_ERROR";

      if (process.env.NODE_ENV === "development") {
        console.log("[LoginPage] auth error:", authError);
      }

      const errorMessage =
        dictionary.authErrors[errorCode as keyof typeof dictionary.authErrors] ??
        dictionary.authErrors.UNKNOWN_ERROR;

      toast(dictionary.login.error, {
        variant: "danger",
        description: errorMessage,
      });
      setLoading(false);
    } else {
      router.push(`/${lang}/`);
      router.refresh();
    }
  };

  const onSocialSignIn = async (provider: SocialProvider) => {
    setSocialLoading(provider);
    const { error: authError } = await authClient.signIn.social({
      provider: provider.toLowerCase() as "google" | "github" | "facebook",
      callbackURL: `/${lang}/`,
    });

    if (authError) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[LoginPage] ${provider} auth error:`, authError);
      }
      toast(dictionary.login.error, {
        variant: "danger",
        description: dictionary.authErrors.UNKNOWN_ERROR,
      });
    }
    setSocialLoading(null);
  };

  return (
    <main className="min-h-svh w-full flex flex-col items-center justify-center bg-background">
      <Card className="my-auto w-96" variant="transparent">
        <Card.Header className="text-center mb-4">
          <Card.Title className="mb-2 text-3xl font-bold">
            {dictionary.login.title}
          </Card.Title>
          <Card.Description>
            {dictionary.login.description}
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
                if (!value) return dictionary.login.emailRequired;
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
                  return dictionary.login.emailInvalid;
                return null;
              }}
            >
              <Label>{dictionary.login.email}</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <EnvelopeIcon className="size-4 text-foreground" />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder={dictionary.login.emailPlaceholder} />
              </InputGroup>
              <FieldError />
            </TextField>

            <TextField
              isRequired
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              validate={(value) => {
                if (!value) return dictionary.login.passwordRequired;
                if (value.length < 8) return dictionary.login.passwordTooShort;
                return null;
              }}
            >
              <Label>{dictionary.login.password}</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <LockClosedIcon className="size-4 text-foreground" />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder={dictionary.login.passwordPlaceholder} />
                {password && (
                  <InputGroup.Suffix>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label={showPassword ? dictionary.login.hidePassword : dictionary.login.showPassword}
                      onClick={() => setShowPassword((prev) => !prev)}
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

            <Button type="submit" variant="primary" isPending={loading} fullWidth>
              {dictionary.login.signIn}
            </Button>
          </Form>
        </Card.Content>

        <Card.Footer className="flex flex-col">
          <div className="flex w-full items-center gap-3 my-4">
            <Separator className="flex-1" />
            <p className="text-muted text-xs font-medium uppercase">{dictionary.login.or}</p>
            <Separator className="flex-1" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            {SOCIAL_PROVIDERS.map(({ provider, icon }) => (
              <ContinueWithButton
                key={provider}
                provider={provider}
                icon={icon}
                isPending={socialLoading === provider}
                isDisabled={socialLoading !== null}
                onClick={() => onSocialSignIn(provider)}
              />
            ))}
          </div>
        </Card.Footer>
      </Card>

      <Link href={`/${lang}/register`} className="no-underline space-x-1 m-4">
        <span className="text-muted">{dictionary.login.noAccount}</span>
        <span className="underline font-bold">{dictionary.login.signUp}</span>
      </Link>
    </main>
  );
}


interface ContinueWithButtonProps {
  provider: SocialProvider;
  icon: React.ReactNode;
  isPending: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const ContinueWithButton = ({ provider, icon, isPending, isDisabled, onClick }: ContinueWithButtonProps) => {
  const dictionary = useDictionary();

  return (
    <Button
      type="button"
      variant="tertiary"
      className="w-full"
      isPending={isPending}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {icon}
      <span>{dictionary.login.continueWith} {provider}</span>
    </Button>
  );
};