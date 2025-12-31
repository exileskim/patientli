import { HTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type CardVariant = 'default' | 'mint' | 'cream' | 'dark' | 'peach' | 'sage';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  href?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white',
  mint: 'bg-[var(--color-bg-mint)]',
  cream: 'bg-[var(--color-bg-cream)]',
  dark: 'bg-[var(--color-primary)] text-white',
  peach: 'bg-[var(--color-bg-peach)]',
  sage: 'bg-[var(--color-bg-sage)]',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      href,
      hover = true,
      padding = 'none',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-[2.5rem] overflow-hidden
      transition-all duration-300 ease-in-out
      ${variantStyles[variant]}
      ${paddingStyles[padding]}
      ${hover ? 'hover:-translate-y-1 hover:shadow-lg' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    if (href) {
      return (
        <Link href={href} className={`block ${baseStyles}`}>
          {children}
        </Link>
      );
    }

    return (
      <div ref={ref} className={baseStyles} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  className?: string;
}

export function CardImage({ src, alt, aspectRatio = 'auto', className = '' }: CardImageProps) {
  const aspectStyles = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
    auto: '',
  };

  return (
    <div className={`relative w-full overflow-hidden ${aspectStyles[aspectRatio]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}

export function CardContent({ children, padding = 'md', className = '', ...props }: CardContentProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${paddings[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ children, as: Tag = 'h3', className = '', ...props }: CardTitleProps) {
  return (
    <Tag className={`font-heading text-xl mb-2 ${className}`} {...props}>
      {children}
    </Tag>
  );
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ children, className = '', ...props }: CardDescriptionProps) {
  return (
    <p className={`text-[var(--color-text-secondary)] ${className}`} {...props}>
      {children}
    </p>
  );
}

interface CardTagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'dark';
}

export function CardTag({ children, variant = 'default', className = '', ...props }: CardTagProps) {
  const variants = {
    default: 'bg-white/90 text-[var(--color-primary)]',
    dark: 'bg-[var(--color-primary)] text-white',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
