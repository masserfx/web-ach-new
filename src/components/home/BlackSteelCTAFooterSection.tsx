'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';

export function BlackSteelCTAFooterSection() {
  return (
    <section className="relative w-full bg-gradient-to-r from-[#F36F21] to-[#FF8F3C] py-16 px-6 md:px-12 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Side - Heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              Jste připraveni ušetřit na vytápění?
            </h2>
          </motion.div>

          {/* Right Side - CTA Button & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-end gap-4"
          >
            {/* White CTA Button like mockup */}
            <Link
              href="/pripravit-rozpocet"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#F36F21] font-bold text-base rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span>Nezávazná konzultace zdarma</span>
            </Link>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-white">
              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-semibold">{siteConfig.contact.phone}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
