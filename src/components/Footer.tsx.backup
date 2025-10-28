import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';
import { getCompanyYears } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = getCompanyYears();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-brand-accent">AC</span>
              <span className="text-white"> Heating</span>
            </div>
            <p className="text-gray-400 mb-6">
              Česká firma s {yearsInBusiness}letou tradicí v instalaci tepelných čerpadel a fotovoltaiky.
            </p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-brand-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-brand-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-brand-primary transition-colors"
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
                <Link href="/produkty" className="hover:text-white transition-colors">
                  Tepelná čerpadla
                </Link>
              </li>
              <li>
                <Link href="/produkty" className="hover:text-white transition-colors">
                  Fotovoltaika
                </Link>
              </li>
              <li>
                <Link href="/produkty" className="hover:text-white transition-colors">
                  Regulace
                </Link>
              </li>
              <li>
                <Link href="/produkty" className="hover:text-white transition-colors">
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
                <Link href="/o-nas" className="hover:text-white transition-colors">
                  O nás
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
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
                  <a href={`tel:${siteConfig.contact.phoneRaw}`} className="hover:text-white transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
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
            <p className="text-sm text-gray-400">
              © {currentYear} {siteConfig.company.name} Všechna práva vyhrazena.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Ochrana osobních údajů
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Obchodní podmínky
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
