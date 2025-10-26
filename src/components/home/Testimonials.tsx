'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const testimonials = [
  {
    id: 1,
    name: 'Jan Novák',
    location: 'Praha',
    rating: 5,
    text: 'Výborná práce, profesionální přístup a kvalitní instalace. Tepelné čerpadlo funguje perfektně a úspora za vytápění je enormní. Určitě doporučuji!',
    service: 'Tepelné čerpadlo',
    date: '2024-03',
  },
  {
    id: 2,
    name: 'Marie Svobodová',
    location: 'Brno',
    rating: 5,
    text: 'Jsme velmi spokojeni s klimatizací. Montáž proběhla rychle a čistě, technici byli velmi vstřícní a vše nám podrobně vysvětlili. Děkujeme!',
    service: 'Klimatizace',
    date: '2024-02',
  },
  {
    id: 3,
    name: 'Petr Dvořák',
    location: 'Ostrava',
    rating: 5,
    text: 'Skvělý servis od začátku do konce. Pomohli nám s vyřízením dotací, instalace proběhla bez problémů a po roce provozu jsme nadmíru spokojeni.',
    service: 'Fotovoltaika',
    date: '2023-12',
  },
  {
    id: 4,
    name: 'Lenka Horáková',
    location: 'Plzeň',
    rating: 5,
    text: 'Profesionální tým, rychlá komunikace a kvalitní provedení. Tepelné čerpadlo nám ušetřilo více než 60% nákladů na vytápění. Výborná investice!',
    service: 'Tepelné čerpadlo',
    date: '2024-01',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Co říkají naši zákazníci
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Přečtěte si recenze od skutečných zákazníků, kteří si vybrali AC Heating
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="bordered" hover className="h-full">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="w-10 h-10 text-brand-primary/20" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-brand-accent text-brand-accent"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <p className="text-sm text-brand-primary font-semibold mt-1">
                      {testimonial.service}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-5xl font-bold text-brand-primary mb-2">7 500+</div>
            <p className="text-gray-600">Domácností po celé Evropě</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-brand-primary mb-2">1 500+</div>
            <p className="text-gray-600">Instalací ročně</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-brand-primary mb-2">18+ let</div>
            <p className="text-gray-600">Zkušeností na trhu</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
