import { HTMLAttributes, forwardRef } from 'react';

type SectionVariant = 'default' | 'dark' | 'mint' | 'cream';
type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: SectionVariant;
  padding?: SectionPadding;
  as?: 'section' | 'div' | 'article';
}

const variantStyles: Record<SectionVariant, string> = {
  default: 'bg-white',
  dark: 'bg-[var(--color-bg-dark)] text-white',
  mint: 'bg-[var(--color-bg-mint)]',
  cream: 'bg-[var(--color-bg-cream)]',
};

const paddingStyles: Record<SectionPadding, string> = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'lg',
      as: Tag = 'section',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLElement>}
        className={`
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Section.displayName = 'Section';
