'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Calculator, FileText, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

type CTAVariant = 'default' | 'urgent' | 'calculation' | 'phone' | 'documentation';

interface DynamicCTAProps {
  variant?: CTAVariant;
  className?: string;
  href?: string;
  phoneNumber?: string;
  label?: string;
}

const ctaVariants: Record<CTAVariant, {
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
}> = {
  default: {
    label: 'Nezávazná poptávka',
    icon: <ArrowRight className="w-5 h-5" />,
    bgColor: 'bg-brand-primary',
    hoverColor: 'hover:bg-brand-primary/90',
  },
  urgent: {
    label: 'Zavolej nám hned',
    icon: <Phone className="w-5 h-5" />,
    bgColor: 'bg-brand-primary',
    hoverColor: 'hover:bg-brand-primary/90',
  },
  calculation: {
    label: 'Spočítej úsporu',
    icon: <Calculator className="w-5 h-5" />,
    bgColor: 'bg-brand-secondary',
    hoverColor: 'hover:bg-brand-secondary/90',
  },
  phone: {
    label: 'Kontaktuj nás',
    icon: <Phone className="w-5 h-5" />,
    bgColor: 'bg-brand-primary',
    hoverColor: 'hover:bg-brand-primary/90',
  },
  documentation: {
    label: 'Stáhni průvodce',
    icon: <FileText className="w-5 h-5" />,
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
  },
};

export function DynamicCTA({
  variant = 'default',
  className = '',
  href = '/pripravit-rozpocet',
  phoneNumber = '+420725539825',
  label,
}: DynamicCTAProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const config = ctaVariants[variant];
  const displayLabel = label || config.label;

  // Phone link variant
  if (variant === 'phone' || variant === 'urgent') {
    return (
      <a
        href={`tel:${phoneNumber}`}
        className={`inline-flex items-center gap-2 px-6 py-3 ${config.bgColor} text-white rounded-lg font-semibold ${config.hoverColor} transition-colors ${className}`}
      >
        {config.icon}
        {displayLabel}
      </a>
    );
  }

  // Regular link variant
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-6 py-3 ${config.bgColor} text-white rounded-lg font-semibold ${config.hoverColor} transition-colors ${className}`}
    >
      {config.icon}
      {displayLabel}
    </Link>
  );
}

// Hero CTA - Larger variant for hero sections
export function HeroCTA({
  variant = 'default',
  href = '/pripravit-rozpocet',
}: {
  variant?: CTAVariant;
  href?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const config = ctaVariants[variant];

  if (variant === 'phone' || variant === 'urgent') {
    return (
      <a
        href={`tel:+420725539825`}
        className={`inline-flex items-center gap-2 px-10 py-5 ${config.bgColor} text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-lg ${config.hoverColor} transition-all`}
      >
        {config.icon}
        {config.label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-10 py-5 ${config.bgColor} text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-lg ${config.hoverColor} transition-all`}
    >
      {config.icon}
      {config.label}
    </Link>
  );
}
