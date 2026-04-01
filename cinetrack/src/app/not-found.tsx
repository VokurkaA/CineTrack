import { getDictionary, Locale } from '@/lib/get-dictionary';
import { headers } from 'next/headers';
import { Link } from '@heroui/react';
import { Suspense } from 'react';

async function NotFoundContent() {
  const headersList = await headers();
  const referer = headersList.get('referer');
  const acceptLanguage = headersList.get('accept-language');

  let lang: Locale = 'en';

  if (referer) {
    try {
      const url = new URL(referer);
      if (url.pathname.startsWith('/cs/') || url.pathname === '/cs') {
        lang = 'cs';
      }
    } catch {
    }
  }

  if (lang === 'en' && acceptLanguage?.toLowerCase().includes('cs')) {
    lang = 'cs';
  }

  const dictionary = await getDictionary(lang);

  return (
    <div className="bg-background min-h-svh w-full flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-7xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">{dictionary.notFound.title}</h2>
      <p className="text-muted-foreground max-w-md">
        {dictionary.notFound.description}
      </p>
      <Link href={`/${lang}/`}>
        {dictionary.notFound.goHome}
        <Link.Icon />
      </Link>
    </div>
  );
}

export default function RootNotFound() {
  return (
    <Suspense>
      <NotFoundContent />
    </Suspense>
  );
}
