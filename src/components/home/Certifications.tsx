'use client';

import { motion } from 'framer-motion';
import { Award, ShieldCheck, BadgeCheck, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { siteConfig } from '@/lib/site.config';

const certifications = [
  {
    id: 1,
    icon: Award,
    title: 'APVTC',
    description: 'Asociace pro vodu, teplo a chlazení - členství a certifikace',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'CFA',
    description: 'Certifikace Cooling & Heating Association',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 3,
    icon: BadgeCheck,
    title: 'CTI',
    description: 'Cooling Technology Institute - mezinárodní certifikace',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 4,
    icon: ThumbsUp,
    title: `${siteConfig.features.warrantyYears} let záruky`,
    description: 'Prodloužená záruka na všechny naše instalace',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const partners = [
  { name: 'Daikin', category: 'Tepelná čerpadla & Klimatizace' },
  { name: 'Mitsubishi', category: 'Klimatizace' },
  { name: 'Panasonic', category: 'Tepelná čerpadla' },
  { name: 'LG', category: 'Tepelná čerpadla' },
];

export function Certifications() {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Certifikace a partnerstv\u00ed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Naše kvalita je potvrzena certifikacemi a partnerstvími s předními výrobci
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${cert.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${cert.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {cert.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Autorizovaní partneři
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {partner.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {partner.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 px-12 py-6 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-2xl">
            <div>
              <p className="text-3xl font-bold text-brand-primary">{siteConfig.features.experienceYears}+</p>
              <p className="text-sm text-gray-600">let zkušeností</p>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div>
              <p className="text-3xl font-bold text-brand-primary">{siteConfig.features.employees}+</p>
              <p className="text-sm text-gray-600">zaměstnanců</p>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div>
              <p className="text-3xl font-bold text-brand-primary">{siteConfig.features.totalHomes}+</p>
              <p className="text-sm text-gray-600">domácností po Evropě</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
