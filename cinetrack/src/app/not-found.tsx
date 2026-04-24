import { getDictionary, Locale } from '@/lib/get-dictionary';
import { headers } from 'next/headers';
import { LocaleLink } from '@/app/components/LocaleLink';
import { LinkIcon } from '@heroui/react';
import { Suspense } from 'react';

async function NotFoundContent() {
  const headersList = await headers();
  const lang = (headersList.get('x-locale') || 'en') as Locale;

  const dictionary = await getDictionary(lang);

  return (
    <div className="bg-background min-h-svh w-full flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-7xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">{dictionary.notFound.title}</h2>
      <p className="text-muted-foreground max-w-md">
        {dictionary.notFound.description}
      </p>
      <LocaleLink href="/">
        {dictionary.notFound.goHome}
        <LinkIcon />
      </LocaleLink>
    </div>
  );
}

export default function RootNotFound() {
    return (<Suspense>
        <NotFoundContent/>
    </Suspense>);
}
