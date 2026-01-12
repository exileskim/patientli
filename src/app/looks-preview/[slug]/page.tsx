import LooksPreviewClient from './LooksPreviewClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LooksPreviewPage({ params }: PageProps) {
  const { slug } = await params;

  return <LooksPreviewClient slug={slug} />;
}
