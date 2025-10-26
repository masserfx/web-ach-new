'use client';

import { Download, Calculator, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

type MagnetType = 'whitepaper' | 'calculator' | 'checklist' | 'assessment';

interface LeadMagnetProps {
  type: MagnetType;
  title: string;
  description: string;
  benefits?: string[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

const magnetConfigs: Record<MagnetType, {
  icon: React.ReactNode;
  color: string;
  gradient: string;
}> = {
  whitepaper: {
    icon: <Download className="w-8 h-8" />,
    color: 'bg-blue-50 border-blue-200',
    gradient: 'from-blue-600 to-blue-700',
  },
  calculator: {
    icon: <Calculator className="w-8 h-8" />,
    color: 'bg-green-50 border-green-200',
    gradient: 'from-green-600 to-green-700',
  },
  checklist: {
    icon: <CheckCircle className="w-8 h-8" />,
    color: 'bg-purple-50 border-purple-200',
    gradient: 'from-purple-600 to-purple-700',
  },
  assessment: {
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-amber-50 border-amber-200',
    gradient: 'from-amber-600 to-amber-700',
  },
};

export function LeadMagnet({
  type,
  title,
  description,
  benefits = [],
  ctaText = 'Získej bezplatně',
  ctaHref = '/pripravit-rozpocet',
  className = '',
}: LeadMagnetProps) {
  const config = magnetConfigs[type];

  return (
    <div className={`${config.color} rounded-2xl border-2 p-8 hover:shadow-lg transition-all ${className}`}>
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${config.gradient} text-white mb-4`}>
        {config.icon}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 mb-6">{description}</p>

      {benefits.length > 0 && (
        <ul className="space-y-2 mb-8">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={ctaHref}
        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-lg font-semibold hover:shadow-lg transition-all`}
      >
        <Download className="w-4 h-4" />
        {ctaText}
      </Link>
    </div>
  );
}

// Grid component pro více lead magnets
export function LeadMagnetGrid({
  magnets,
  className = '',
}: {
  magnets: LeadMagnetProps[];
  className?: string;
}) {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-${Math.min(magnets.length, 3)} gap-8 ${className}`}>
      {magnets.map((magnet, idx) => (
        <LeadMagnet key={idx} {...magnet} />
      ))}
    </div>
  );
}
