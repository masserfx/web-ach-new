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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-brand-primary">AC</span>
              <span className="text-brand-secondary"> Heating</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-brand-primary font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/pripravit-rozpocet"
              className="px-6 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors"
            >
              Poptávka
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
            className="md:hidden overflow-hidden bg-white border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-brand-primary font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/pripravit-rozpocet"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 bg-brand-primary text-white rounded-lg font-semibold text-center hover:bg-brand-primary/90 transition-colors"
              >
                Nezávazná poptávka
              </Link>

              {/* Mobile Contact Info */}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors"
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
