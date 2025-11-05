'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

  // Helper funkce pro active state
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Skip to main content link - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2"
      >
        Přeskočit na hlavní obsah
      </a>
      
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
              {navItems.map((item) => {
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative font-medium transition-all duration-200',
                      // Default state
                      'text-steel hover:text-accent',
                      // Active state
                      active && 'text-accent font-bold',
                      // Focus state
                      'focus:outline-none focus:text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-carbon rounded px-2 py-1'
                    )}
                  >
                    {item.label}
                    
                    {/* Active indicator underline */}
                    {active && (
                      <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent rounded-full transition-all" />
                    )}
                  </Link>
                );
              })}

              <ThemeToggle />
              
              <Link
                href="/pripravit-rozpocet"
                className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-dark"
                aria-label="Odeslat nezávaznou poptávku"
              >
                Poptávka
              </Link>
            </div>

            {/* Mobile Menu Button + Theme Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-graphite-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block py-3 px-4 rounded-lg font-medium transition-all duration-200',
                        // Default state
                        'text-steel hover:bg-graphite-light hover:text-accent',
                        // Active state - s left borderem
                        active && 'bg-graphite text-accent font-bold border-l-4 border-accent'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

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
                    className="flex items-center gap-2 text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{siteConfig.contact.phone}</span>
                  </a>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center gap-2 text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent"
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
    </>
  );
}
