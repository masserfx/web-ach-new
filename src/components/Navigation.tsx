'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Domů' },
    { href: '/regulace', label: 'Regulace xCC' },
    { href: '/produkty', label: 'Produkty' },
    { href: '/novinky', label: 'Novinky' },
    { href: '/blog', label: 'Blog' },
    { href: '/o-nas', label: 'O nás' },
    { href: '/o-spolecnosti', label: 'O společnosti' },
    { href: '/kariera', label: 'Kariéra' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-carbon/95 backdrop-blur-sm border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-accent">AC</span>
              <span className="text-accent-dark"> Heating</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-steel hover:text-accent font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/pripravit-rozpocet"
              className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              aria-label="Odeslat nezávaznou poptávku"
            >
              Poptávka
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-graphite-light transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-carbon border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 rounded-lg text-steel hover:bg-graphite-light hover:text-accent font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/pripravit-rozpocet"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 bg-accent text-white rounded-lg font-semibold text-center hover:bg-accent/90 transition-colors"
                aria-label="Odeslat nezávaznou poptávku"
              >
                Nezávazná poptávka
              </Link>

              {/* Mobile Contact Info */}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="flex items-center gap-2 text-steel-dim hover:text-accent transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2 text-steel-dim hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
