import { redirect } from 'next/navigation';

export default function BrandRedirectPage({ params }: { params: { slug: string } }) {
  redirect(`/looks?practice=${encodeURIComponent(params.slug)}`);
}

