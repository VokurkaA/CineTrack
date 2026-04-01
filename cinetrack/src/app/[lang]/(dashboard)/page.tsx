import { getDictionary, Locale } from "@/lib/get-dictionary";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{dictionary.home.welcome}</h1>
      <p className="mt-4 text-muted-foreground">
        {dictionary.home.loggedInMessage}
      </p>
    </div>
  );
}
