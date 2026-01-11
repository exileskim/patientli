import { redirect } from 'next/navigation';

export default function ResourceAliasPage({ params }: { params: { slug: string } }) {
  redirect(`/resources/${encodeURIComponent(params.slug)}`);
}

