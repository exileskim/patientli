'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';

// Simplified resource data for the catalog page
const resources = [
  {
    id: '1',
    slug: 'ai-knowledge-snapshot',
    title: 'AI Knowledge Snapshot',
    type: 'report',
    description: 'Find out what AI knows about your practice with this free instant report.',
  },
  {
    id: '2',
    slug: 'dental-treatment-plan-template',
    title: 'Dental Treatment Plan Template',
    type: 'template',
    description: 'A professional template to present treatment plans to patients.',
  },
  {
    id: '3',
    slug: 'intro-to-seo-for-dentists',
    title: 'Intro to SEO for Dentists',
    type: 'e-book',
    description: 'Learn the fundamentals of SEO to grow your practice visibility online.',
  },
  {
    id: '4',
    slug: 'patient-review-request-template',
    title: 'Patient Review Request Templates',
    type: 'template',
    description: 'Ready-to-use templates for handout, email, and text review requests.',
  },
  {
    id: '5',
    slug: 'dental-marketing-guide',
    title: 'The Complete Guide to Dental Marketing',
    type: 'e-book',
    description: 'A comprehensive guide to modern dental practice marketing strategies.',
  },
  {
    id: '6',
    slug: 'social-media-for-dentists-post-templates',
    title: 'Social Media Post Templates',
    type: 'template',
    description: 'Professional social media templates designed for dental practices.',
  },
];

// Type filters
const types = [
  { id: 'e-book', label: 'E-Book' },
  { id: 'report', label: 'Report' },
  { id: 'template', label: 'Template' },
];

export default function ResourcesPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    if (!selectedType) return resources;
    return resources.filter(resource => resource.type === selectedType);
  }, [selectedType]);

  return (
    <>
      <Header variant="light" />

      <main className="min-h-screen bg-white">
        <Container>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 py-12">
            {/* Sidebar */}
            <aside className="space-y-6">
              <p className="text-[var(--color-text-secondary)]">
                Filter resources by type.
              </p>

              {/* Type Filters */}
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`block w-full text-left py-2 transition-colors ${
                    !selectedType
                      ? 'text-[var(--color-primary)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  All Resources
                </button>
                {types.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                    className={`block w-full text-left py-2 transition-colors ${
                      selectedType === type.id
                        ? 'text-[var(--color-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

interface Resource {
  id: string;
  slug: string;
  title: string;
  type: string;
  description: string;
}

function ResourceCard({ resource }: { resource: Resource }) {
  const typeLabel = types.find(t => t.id === resource.type)?.label || resource.type;

  // Get background color based on type
  const getBgColor = () => {
    switch (resource.type) {
      case 'report':
        return 'bg-[var(--color-bg-peach)]';
      case 'e-book':
        return 'bg-[var(--color-bg-mint)]';
      case 'template':
        return 'bg-[var(--color-bg-cream)]';
      default:
        return 'bg-[var(--color-bg-cream)]';
    }
  };

  return (
    <div className={`${getBgColor()} rounded-3xl p-8 flex flex-col min-h-[320px]`}>
      {/* Type Tag */}
      <span className="inline-block self-start px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-xs font-medium uppercase tracking-wide mb-4">
        {typeLabel}
      </span>

      {/* Title */}
      <h2 className="text-2xl font-heading mb-4">
        {resource.title}
      </h2>

      {/* Description */}
      <p className="text-[var(--color-text-secondary)] mb-6 flex-grow">
        {resource.description}
      </p>

      {/* Preview placeholder */}
      <div className="aspect-[16/9] bg-white/50 rounded-xl mb-6" />

      {/* CTA Button */}
      <Link
        href={`/resources/${resource.slug}`}
        className="w-full flex items-center justify-center px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors"
      >
        {typeLabel} details
      </Link>
    </div>
  );
}
