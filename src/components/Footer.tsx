import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';
import { getCompanyYears } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = getCompanyYears();

  return (
    <footer className="bg-carbon text-steel-dim/60">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-brand-accent">AC</span>
              <span className="text-white"> Heating</span>
            </div>
            <p className="text-steel-dim/70 mb-6">
              Česká firma s {yearsInBusiness}letou tradicí v instalaci tepelných čerpadel a fotovoltaiky.
            </p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-graphite border border-graphite-light/50 text-steel hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-carbon"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-graphite border border-graphite-light/50 text-steel hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-carbon"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-graphite border border-graphite-light/50 text-steel hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-carbon"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Produkty</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/produkty" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                  Tepelná čerpadla
                </Link>
              </li>
              <li>
                <Link href="/produkty" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                  Fotovoltaika
                </Link>
              </li>
              <li>
                <Link href="/produkty" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                  Regulace
                </Link>
              </li>
              <li>
                <Link href="/produkty" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                  Příslušenství
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Firma</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/o-nas" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                  O nás
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <a href={`tel:${siteConfig.contact.phoneRaw}`} className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{siteConfig.company.name}</p>
                  <p>{siteConfig.contact.address.city}, {siteConfig.contact.address.country}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-steel-dim/70">
              © {currentYear} {siteConfig.company.name} Všechna práva vyhrazena.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                Ochrana osobních údajů
              </Link>
              <Link href="/terms" className="text-steel-dim hover:text-accent transition-colors focus:outline-none focus:text-accent focus:underline">
                Obchodní podmínky
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
