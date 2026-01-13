import Image from 'next/image';

import type { LookContentV1 } from '../domain/content.schema';

export type LookWebsiteTemplateId = 'circle' | 'tile' | 'wellness' | 'editorial';

export type LookWebsiteTemplateConfig = {
  id: LookWebsiteTemplateId;
  heroBackground: 'primary' | 'surface' | 'accent';
  heroTone?: 'light' | 'dark';
  showLogos?: boolean;
  showStats?: boolean;
  showAppointmentForm?: boolean;
  locationsCount?: 2 | 3;
};

const templateBySlug: Record<string, LookWebsiteTemplateConfig> = {
  'luna-smiles': { id: 'circle', heroBackground: 'accent', heroTone: 'dark', showLogos: true, showAppointmentForm: true, locationsCount: 2 },
  'grincraft': { id: 'circle', heroBackground: 'primary', showLogos: true, locationsCount: 3 },
  'radiance': { id: 'circle', heroBackground: 'accent', locationsCount: 2 },
  'brilliance': { id: 'circle', heroBackground: 'primary', showLogos: true, locationsCount: 3 },
  'aura': { id: 'circle', heroBackground: 'primary', showLogos: true, locationsCount: 2 },
  'arches': { id: 'circle', heroBackground: 'primary', showLogos: true, locationsCount: 2 },
  'lumena': { id: 'circle', heroBackground: 'primary', showLogos: true, locationsCount: 3 },
  'enamel': { id: 'circle', heroBackground: 'surface', showLogos: true, showAppointmentForm: true, locationsCount: 2 },

  'illume': { id: 'tile', heroBackground: 'primary', showLogos: false, showStats: false },
  'soho-orthodontics': { id: 'tile', heroBackground: 'primary', showStats: true },
  'seaport-smiles': { id: 'tile', heroBackground: 'primary', showStats: true },

  'align-chiropractics': { id: 'wellness', heroBackground: 'surface', showStats: false, locationsCount: 3 },
  'balance-chiropractic': { id: 'wellness', heroBackground: 'surface', showStats: false, locationsCount: 3 },

  'pureglow': { id: 'editorial', heroBackground: 'surface', showStats: false, locationsCount: 2 },
};

export function getLookWebsiteTemplate(slug: string): LookWebsiteTemplateConfig {
  return templateBySlug[slug] ?? { id: 'circle', heroBackground: 'primary', showLogos: true, showAppointmentForm: true, locationsCount: 2 };
}

type SharedPreviewProps = {
  template: LookWebsiteTemplateConfig;
  displayName: string;
  practiceLogoUrl?: string;
  phoneDisplay: string;
  contactLine: string;
  heroImage: string;
  content: LookContentV1;
  highlights: string[];
  services: string[];
};

function heroBackgroundClass(template: LookWebsiteTemplateConfig, tone: 'light' | 'dark') {
  const textClass = tone === 'dark' ? 'text-white' : 'text-[var(--color-primary)]';
  switch (template.heroBackground) {
    case 'accent':
      return `bg-[var(--color-accent)] ${textClass}`;
    case 'surface':
      return `bg-[var(--color-bg-cream)] ${textClass}`;
    case 'primary':
    default:
      return `bg-[var(--color-primary)] ${textClass}`;
  }
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M10.15 2.6c0-.88.72-1.6 1.6-1.6h2.5c.88 0 1.6.72 1.6 1.6v5.95c0 .88-.72 1.6-1.6 1.6h-2.5c-.88 0-1.6-.72-1.6-1.6V2.6z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M2.6 10.15c-.88 0-1.6.72-1.6 1.6v2.5c0 .88.72 1.6 1.6 1.6h5.95c.88 0 1.6-.72 1.6-1.6v-2.5c0-.88-.72-1.6-1.6-1.6H2.6z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M17.45 10.15c-.88 0-1.6.72-1.6 1.6v2.5c0 .88.72 1.6 1.6 1.6h5.95c.88 0 1.6-.72 1.6-1.6v-2.5c0-.88-.72-1.6-1.6-1.6h-5.95z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M10.15 17.45c0-.88.72-1.6 1.6-1.6h2.5c.88 0 1.6.72 1.6 1.6v5.95c0 .88-.72 1.6-1.6 1.6h-2.5c-.88 0-1.6-.72-1.6-1.6v-5.95z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

function StarAccent({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 56 56"
      className={className}
      fill="none"
    >
      <path
        d="M28 2l4.4 16.2L54 28l-21.6 9.8L28 54l-4.4-16.2L2 28l21.6-9.8L28 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function DemoHeader({
  displayName,
  practiceLogoUrl,
  tone,
}: {
  displayName: string;
  practiceLogoUrl?: string;
  tone: 'light' | 'dark';
}) {
  const textClass = tone === 'dark' ? 'text-white' : 'text-[var(--color-primary)]';
  const mutedClass = tone === 'dark' ? 'text-white/70' : 'text-[var(--color-text-muted)]';
  const borderClass = tone === 'dark' ? 'border-white/15' : 'border-black/10';

  return (
    <header className={`flex items-center justify-between gap-4 border-b ${borderClass} px-8 py-5 ${textClass}`}>
      <div className="flex items-center gap-3">
        {practiceLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={practiceLogoUrl} alt={`${displayName} logo`} className="h-7 w-auto object-contain" />
        ) : (
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="font-heading text-sm tracking-[0.25em] uppercase">{displayName}</span>
          </div>
        )}
      </div>
      <nav className={`hidden items-center gap-5 text-[10px] uppercase tracking-[0.22em] ${mutedClass} md:flex`}>
        <span>Services</span>
        <span>About</span>
        <span>Team</span>
        <span>Blog</span>
        <span>Contact</span>
      </nav>
      <span
        className={`inline-flex rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
          tone === 'dark' ? 'bg-white text-[var(--color-primary)]' : 'bg-[var(--color-primary)] text-white'
        }`}
      >
        Book now
      </span>
    </header>
  );
}

function LogoStrip() {
  const items = ['ADA', 'AOMT', 'cdi'];
  return (
    <div className="bg-white px-8 py-7">
      <p className="text-center text-xs text-[var(--color-text-muted)]">
        We&apos;re proud to be associated with the following organizations
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-8 text-[11px] font-semibold tracking-[0.3em] text-[var(--color-text-muted)]">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-[var(--color-border)] px-4 py-2">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function LocationsSection({
  displayName,
  contactLine,
  count,
}: {
  displayName: string;
  contactLine: string;
  count: 2 | 3;
}) {
  const cards = Array.from({ length: count }).map((_, index) => ({
    title: index === 0 ? 'Downtown' : index === 1 ? 'Main Street' : 'Westside',
  }));

  return (
    <section className="bg-white px-8 py-10">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-[var(--color-primary)]">Locations</h3>
        <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{displayName}</span>
      </div>
      <div className={`mt-6 grid gap-5 ${count === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {cards.map((card) => (
          <div key={card.title} className="overflow-hidden rounded-3xl border border-black/5 bg-[var(--color-bg-cream)] shadow-sm">
            <div className="h-32 bg-[var(--color-bg-mint)]" />
            <div className="space-y-2 px-5 py-5 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-center justify-between">
                <p className="font-heading text-base text-[var(--color-primary)]">{card.title}</p>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                  View
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{contactLine}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ highlights }: { highlights: string[] }) {
  const questions = [
    { q: 'Do you accept new patients?', a: highlights[0] ?? 'Yes — appointments are available this week.' },
    { q: 'What insurance do you accept?', a: highlights[1] ?? 'We help you understand coverage and options.' },
    { q: 'How do I request an appointment?', a: highlights[2] ?? 'Use the booking button or call our team.' },
  ];

  return (
    <section className="bg-[var(--color-bg-cream)] px-8 py-10">
      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h3 className="font-heading text-xl text-[var(--color-primary)]">Frequently Asked Questions</h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Quick answers to help you plan your visit.
          </p>
        </div>
        <div className="space-y-3">
          {questions.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-[var(--color-primary)]">
                <span>{item.q}</span>
                <span className="text-[var(--color-text-muted)] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppointmentForm({
  content,
  displayName,
}: {
  content: LookContentV1;
  displayName: string;
}) {
  return (
    <section className="bg-[var(--color-primary)] px-8 py-12 text-white">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h3 className="font-heading text-2xl">{content.footerCta.headline}</h3>
          <p className="mt-3 text-sm text-white/80">{content.footerCta.body}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-white/60">
            {displayName}
          </p>
        </div>
        <div className="rounded-3xl bg-white/10 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/70">Name</label>
              <div className="mt-2 h-10 rounded-xl bg-white/15" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/70">Email</label>
              <div className="mt-2 h-10 rounded-xl bg-white/15" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-[0.2em] text-white/70">Message</label>
            <div className="mt-2 h-20 rounded-2xl bg-white/15" />
          </div>
          <div className="mt-6 inline-flex rounded-full bg-[var(--color-accent)] px-5 py-3 text-xs font-semibold text-[var(--color-primary)]">
            {content.footerCta.ctaLabel}
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoFooter({ displayName, contactLine }: { displayName: string; contactLine: string }) {
  return (
    <footer className="bg-[var(--color-bg-dark)] px-8 py-10 text-white">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-heading text-lg">{displayName}</p>
          <p className="mt-2 text-sm text-white/70">{contactLine}</p>
          <div className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/70">
            Book appointment
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 text-sm text-white/70">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Services</p>
            <ul className="mt-3 space-y-2">
              <li>General dentistry</li>
              <li>Cosmetic care</li>
              <li>Implants</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Company</p>
            <ul className="mt-3 space-y-2">
              <li>About</li>
              <li>Team</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Follow</p>
            <ul className="mt-3 space-y-2">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CircleTemplate({
  template,
  displayName,
  practiceLogoUrl,
  phoneDisplay,
  contactLine,
  heroImage,
  content,
  highlights,
  services,
}: SharedPreviewProps) {
  const tone = template.heroTone ?? (template.heroBackground === 'surface' ? 'light' : 'dark');
  const heroBg = heroBackgroundClass(template, tone);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className={`relative ${heroBg}`}>
        <DemoHeader displayName={displayName} practiceLogoUrl={practiceLogoUrl} tone={tone} />

        <div className="grid gap-8 px-8 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className={`text-[10px] uppercase tracking-[0.22em] ${tone === 'dark' ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
              Modern care
            </p>
            <h2 className="mt-4 font-heading text-4xl leading-[1.05]">{content.hero.headline}</h2>
            <p className={`mt-4 text-sm ${tone === 'dark' ? 'text-white/80' : 'text-[var(--color-text-muted)]'}`}>
              {content.hero.subhead}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <span
                className={`inline-flex rounded-full px-5 py-3 font-semibold ${
                  template.heroBackground === 'primary'
                    ? tone === 'dark'
                      ? 'bg-[var(--color-accent)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-primary)] text-white'
                }`}
              >
                {content.hero.ctaLabel}
              </span>
              <span
                className={`inline-flex rounded-full px-5 py-3 ${
                  tone === 'dark'
                    ? 'border border-white/30 text-white'
                    : 'border border-[var(--color-border)] text-[var(--color-primary)]'
                }`}
              >
                Call {phoneDisplay}
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative h-64 w-64 md:h-72 md:w-72">
              <div
                className="absolute inset-0 rounded-full opacity-35"
                style={{ backgroundColor: tone === 'dark' ? 'rgba(255,255,255,0.14)' : 'var(--color-accent)' }}
              />
              <div className="absolute inset-6 overflow-hidden rounded-full bg-white/20">
                <Image src={heroImage} alt="Preview hero" width={600} height={600} className="h-full w-full object-cover" />
              </div>
              <StarAccent className="absolute -bottom-6 right-10 h-12 w-12 text-[var(--color-accent)] opacity-90" />
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[var(--color-bg-mint)] px-8 py-9 text-center">
        <p className="text-xs font-medium text-[var(--color-text-muted)]">Crafting smiles with precision and care</p>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-[var(--color-text-secondary)]">{content.about}</p>
      </section>

      <section className="bg-white px-8 py-10">
        <h3 className="font-heading text-xl text-[var(--color-primary)]">Dental services</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm text-[var(--color-text-secondary)]">
          {services.map((service) => (
            <div key={service} className="rounded-3xl border border-black/5 bg-[var(--color-bg-cream)] px-5 py-5">
              <p className="font-heading text-base text-[var(--color-primary)]">{service}</p>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Personalized care designed around your schedule.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-bg-dark)] px-8 py-10 text-white">
        <h3 className="font-heading text-xl">Why patients love us</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlights.slice(0, 3).map((highlight) => (
            <div key={highlight} className="rounded-3xl bg-white/8 px-6 py-6 text-sm text-white/80">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Review</p>
              <p className="mt-3 font-heading text-base text-white">&quot;{highlight}.&quot;</p>
              <p className="mt-3 text-xs text-white/60">— {displayName} patient</p>
            </div>
          ))}
        </div>
      </section>

      {template.showLogos ? <LogoStrip /> : null}

      <LocationsSection displayName={displayName} contactLine={contactLine} count={template.locationsCount ?? 2} />
      <FaqSection highlights={highlights} />

      {template.showAppointmentForm ? <AppointmentForm content={content} displayName={displayName} /> : null}
      <DemoFooter displayName={displayName} contactLine={contactLine} />
    </div>
  );
}

function TileTemplate(props: SharedPreviewProps) {
  const { template, displayName, practiceLogoUrl, phoneDisplay, contactLine, heroImage, content, highlights, services } =
    props;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className={`bg-[var(--color-primary)] text-white`}>
        <DemoHeader displayName={displayName} practiceLogoUrl={practiceLogoUrl} tone="dark" />

        <div className="grid gap-10 px-8 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="font-heading text-4xl leading-[1.05]">{content.hero.headline}</h2>
            <p className="mt-4 text-sm text-white/80">{content.hero.subhead}</p>
            <div className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-xs font-semibold text-[var(--color-primary)]">
              {content.hero.ctaLabel}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[32px] bg-white/15 p-6">
            <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/10" />
            <div className="overflow-hidden rounded-[26px] bg-black/20">
              <Image src={heroImage} alt="Preview portrait" width={560} height={560} className="h-full w-full object-cover grayscale" />
            </div>
          </div>
        </div>
      </div>

      {template.showStats ? (
        <section className="bg-[var(--color-bg-cream)] px-8 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Years serving patients', value: '15+' },
              { label: 'Five-star reviews', value: 'Top rated' },
              { label: 'Same-week visits', value: 'Fast booking' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-white px-6 py-6 text-center shadow-sm">
                <p className="font-heading text-2xl text-[var(--color-primary)]">{item.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-white px-8 py-10">
        <h3 className="font-heading text-xl text-[var(--color-primary)]">Services</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <div key={service} className="rounded-3xl border border-black/5 bg-[var(--color-bg-cream)] px-6 py-6">
              <p className="font-heading text-base text-[var(--color-primary)]">{service}</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Thoughtful care designed around your goals.
              </p>
              <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Learn more
              </div>
            </div>
          ))}
        </div>
      </section>

      <FaqSection highlights={highlights} />

      <section className="bg-[var(--color-bg-mint)] px-8 py-10">
        <h3 className="font-heading text-xl text-[var(--color-primary)]">Hear from our patients</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlights.slice(0, 3).map((highlight) => (
            <div key={highlight} className="rounded-3xl bg-white px-6 py-6 text-sm text-[var(--color-text-muted)] shadow-sm">
              &quot;{highlight}.&quot;
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                {displayName} patient
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-3xl bg-[var(--color-bg-cream)]">
            <div className="h-56 bg-[var(--color-bg-mint)]" />
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Location spotlight</p>
            <h3 className="font-heading text-2xl text-[var(--color-primary)]">{displayName}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">{contactLine}</p>
            <div className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-xs font-semibold text-white">
              Book now
            </div>
          </div>
        </div>
      </section>

      <DemoFooter displayName={displayName} contactLine={contactLine} />
    </div>
  );
}

function WellnessTemplate(props: SharedPreviewProps) {
  const { template, displayName, practiceLogoUrl, phoneDisplay, contactLine, heroImage, content, highlights, services } =
    props;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="bg-[var(--color-bg-cream)] text-[var(--color-primary)]">
        <DemoHeader displayName={displayName} practiceLogoUrl={practiceLogoUrl} tone="light" />
        <div className="grid gap-10 px-8 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Chiropractic in your neighborhood
            </p>
            <h2 className="mt-4 font-heading text-4xl leading-[1.05]">{content.hero.headline}</h2>
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">{content.hero.subhead}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 font-semibold text-white">
                {content.hero.ctaLabel}
              </span>
              <span className="inline-flex rounded-full border border-[var(--color-border)] px-5 py-3 text-[var(--color-primary)]">
                Call {phoneDisplay}
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
            <div className="bg-[var(--color-bg-mint)] p-6">
              <div className="overflow-hidden rounded-[26px] bg-[var(--color-primary)]/10">
                <Image src={heroImage} alt="Preview hero" width={560} height={560} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white px-8 py-10 text-center">
        <p className="text-sm font-medium text-[var(--color-primary)]">Live well. Move well.</p>
        <p className="mx-auto mt-3 max-w-3xl text-sm text-[var(--color-text-muted)]">{content.about}</p>
      </section>

      <section className="bg-[var(--color-bg-cream)] px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-3xl bg-[var(--color-bg-mint)]">
            <Image src={heroImage} alt="Preview lifestyle" width={640} height={520} className="h-full w-full object-cover" />
          </div>
          <div className="rounded-3xl bg-white px-7 py-7 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Services</p>
            <h3 className="mt-3 font-heading text-2xl text-[var(--color-primary)]">Care that keeps you moving.</h3>
            <div className="mt-5 space-y-2 text-sm text-[var(--color-text-muted)]">
              {services.map((service) => (
                <div key={service} className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--color-bg-cream)] px-4 py-3">
                  <span className="font-medium text-[var(--color-primary)]">{service}</span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">View</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-[var(--color-text-muted)]">{contactLine}</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-8 py-10">
        <h3 className="font-heading text-xl text-[var(--color-primary)]">Our reviews</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlights.slice(0, 3).map((highlight) => (
            <div key={highlight} className="rounded-3xl border border-black/5 bg-[var(--color-bg-cream)] px-6 py-6 text-sm text-[var(--color-text-muted)]">
              &quot;{highlight}.&quot;
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                {displayName} patient
              </p>
            </div>
          ))}
        </div>
      </section>

      <LocationsSection displayName={displayName} contactLine={contactLine} count={template.locationsCount ?? 3} />
      <FaqSection highlights={highlights} />
      <DemoFooter displayName={displayName} contactLine={contactLine} />
    </div>
  );
}

function EditorialTemplate(props: SharedPreviewProps) {
  const { displayName, practiceLogoUrl, phoneDisplay, contactLine, heroImage, content, highlights, services } = props;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <DemoHeader displayName={displayName} practiceLogoUrl={practiceLogoUrl} tone="light" />
      <div className="relative h-64 bg-[var(--color-bg-cream)]">
        <Image src={heroImage} alt="Preview cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-0 left-0 right-0 px-8 py-7">
          <div className="max-w-xl rounded-3xl bg-white/85 px-6 py-6 backdrop-blur">
            <h2 className="font-heading text-2xl text-[var(--color-primary)]">{content.hero.headline}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{content.hero.subhead}</p>
            <div className="mt-4 inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-xs font-semibold text-white">
              {content.hero.ctaLabel}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[var(--color-bg-cream)] px-8 py-10">
        <h3 className="font-heading text-xl text-[var(--color-primary)]">Discover your look</h3>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">{content.about}</p>
      </section>

      <FaqSection highlights={highlights} />

      <section className="bg-white px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[var(--color-bg-mint)] px-6 py-8">
            <h3 className="font-heading text-xl text-[var(--color-primary)]">Team</h3>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Meet the people behind your new favorite practice.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.slice(0, 4).map((service) => (
              <div key={service} className="rounded-3xl border border-black/5 bg-[var(--color-bg-cream)] px-5 py-6">
                <p className="font-heading text-sm text-[var(--color-primary)]">{service}</p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">Learn more</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] px-8 py-12 text-white">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h3 className="font-heading text-2xl">Ready to get started?</h3>
            <p className="mt-3 text-sm text-white/80">
              Call {phoneDisplay} or schedule your first consultation.
            </p>
            <div className="mt-6 inline-flex rounded-full bg-[var(--color-accent)] px-5 py-3 text-xs font-semibold text-[var(--color-primary)]">
              {content.footerCta.ctaLabel}
            </div>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 text-sm text-white/80">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Contact</p>
            <p className="mt-3 font-heading text-lg text-white">{displayName}</p>
            <p className="mt-2 text-sm text-white/70">{contactLine}</p>
          </div>
        </div>
      </section>

      <DemoFooter displayName={displayName} contactLine={contactLine} />
    </div>
  );
}

export function LookWebsitePreview(props: SharedPreviewProps) {
  switch (props.template.id) {
    case 'tile':
      return <TileTemplate {...props} />;
    case 'wellness':
      return <WellnessTemplate {...props} />;
    case 'editorial':
      return <EditorialTemplate {...props} />;
    case 'circle':
    default:
      return <CircleTemplate {...props} />;
  }
}
