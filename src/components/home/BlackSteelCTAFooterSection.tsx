'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';

export function BlackSteelCTAFooterSection() {
  return (
    <section className="relative w-full bg-cta-gradient py-20 px-6 md:px-12 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
        >
          Jste připraveni ušetřit na vytápění?
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Připravíme vám nezávaznou nabídku do 24 hodin. Bez skrytých nákladů, bez tlaku na koupi.
        </motion.p>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Link
            href="/pripravit-rozpocet"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-white/20 backdrop-blur-md border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            <span>Nezávazná kalkulace zdarma</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="h-px bg-white/20 my-12 max-w-sm mx-auto"
        />

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-white/80 text-lg">
            Nebo nás kontaktujte přímo:
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            {/* Phone Contact */}
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="group flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 group-hover:bg-white/30 transition-all">
                <Phone className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm text-white/70">Zavolat</p>
                <p className="font-bold text-lg">{siteConfig.contact.phone}</p>
              </div>
            </a>

            {/* Email Contact */}
            <a
              href="mailto:info@ac-heating.cz"
              className="group flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 group-hover:bg-white/30 transition-all">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm text-white/70">Email</p>
                <p className="font-bold text-lg">info@ac-heating.cz</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-white/20 space-y-4"
        >
          <p className="text-white/70 text-sm">
            ✓ Bezpečné a chráněné - vaše údaje jsou v bezpečí
          </p>
          <p className="text-white/70 text-sm">
            ✓ Bez závazků - žádné skryté náklady
          </p>
          <p className="text-white/70 text-sm">
            ✓ Rychlá odpověď - kontaktujeme vás do 24 hodin
          </p>
        </motion.div>
      </div>
    </section>
  );
}
