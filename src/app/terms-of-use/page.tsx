import { notFound } from 'next/navigation';

import pages from '@/content/pages.json';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';

export default function TermsOfUsePage() {
  const page = pages.find((entry) => entry.slug === 'terms-of-use');
  if (!page) notFound();

  return (
    <>
      <Header variant="light" />
      <main className="min-h-screen bg-white py-16">
        <Container size="md">
          <h1 className="text-4xl font-heading mb-8">{page.title}</h1>
          <div
            className="space-y-4 text-[var(--color-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
}

