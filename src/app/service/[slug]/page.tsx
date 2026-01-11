import { redirect } from 'next/navigation';

export default function ServiceAliasPage({ params }: { params: { slug: string } }) {
  redirect(`/services/${encodeURIComponent(params.slug)}`);
}

