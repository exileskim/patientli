import { redirect } from 'next/navigation';

export default function SolutionAliasPage({ params }: { params: { slug: string } }) {
  redirect(`/solutions/${encodeURIComponent(params.slug)}`);
}

