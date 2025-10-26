'use client';

import { Star, Users, Award } from 'lucide-react';

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  savings?: string;
}

interface SocialProofProps {
  testimonials: Testimonial[];
  className?: string;
}

export function SocialProofSection({ testimonials, className = '' }: SocialProofProps) {
  const avgRating =
    Math.round(
      (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10
    ) / 10;

  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-black text-brand-primary mb-2">7 500+</div>
              <div className="text-lg font-semibold text-gray-700">Spokojených zákazníků</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 ${i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                ))}
              </div>
              <div className="text-lg font-semibold text-gray-700">{avgRating} z 5 hvězd</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-600 mb-2">18+</div>
              <div className="text-lg font-semibold text-gray-700">Let zkušeností</div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Co si říkají naši zákazníci
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-brand-primary/10 p-8 hover:shadow-3xl transition-all">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.text}"</p>

      {/* Savings */}
      {testimonial.savings && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Roční úspora</div>
          <div className="text-2xl font-black text-green-600">{testimonial.savings}</div>
        </div>
      )}

      {/* Author */}
      <div className="border-t border-gray-200 pt-4">
        <div className="font-bold text-gray-900">{testimonial.name}</div>
        <div className="text-sm text-gray-600">{testimonial.location}</div>
      </div>
    </div>
  );
}

// Trust Badges Section
export function TrustBadges() {
  const badges = [
    {
      icon: <Award className="w-12 h-12" />,
      label: 'Certifikace APVTC',
      description: 'Asociace podnikatelů v tepelné technice',
    },
    {
      icon: <Users className="w-12 h-12" />,
      label: '7 500+ instalací',
      description: 'Proveřené a ověřené zákazníky',
    },
    {
      icon: <Star className="w-12 h-12" />,
      label: '4.8/5 hvězd',
      description: 'Průměrné hodnocení od zákazníků',
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {badges.map((badge, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex p-4 rounded-full bg-brand-primary/10 text-brand-primary mb-4">
                  {badge.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.label}</h3>
                <p className="text-gray-600">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
