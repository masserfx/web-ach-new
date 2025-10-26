import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktujte AC Heating - tepelná čerpadla a fotovoltaika. Telefon, email, adresa. Jsme tu pro vás po celé ČR.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Kontakt
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Rádi vám poradíme s výběrem správného řešení pro váš domov nebo firmu.
              Kontaktujte nás telefonicky, emailem nebo osobně.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Cards */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-8">Kontaktní údaje</h2>

            <ContactCard
              icon={<Phone className="w-6 h-6" />}
              title="Telefon"
              content={siteConfig.contact.phone}
              link={`tel:${siteConfig.contact.phoneRaw}`}
              gradient="from-brand-accent to-orange-600"
            />

            <ContactCard
              icon={<Mail className="w-6 h-6" />}
              title="Email"
              content="info@ac-heating.cz"
              link="mailto:info@ac-heating.cz"
              gradient="from-brand-secondary to-green-600"
            />

            <ContactCard
              icon={<MapPin className="w-6 h-6" />}
              title="Adresa"
              content="AC Heating s.r.o., Praha, Česká republika"
              gradient="from-brand-primary to-amber-700"
            />

            <ContactCard
              icon={<Clock className="w-6 h-6" />}
              title="Pracovní doba"
              content="Po-Pá: 8:00 - 17:00"
              gradient="from-purple-600 to-pink-600"
            />
          </div>

          {/* Quick Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Rychlý kontakt</h2>
            <p className="text-gray-600 mb-6">
              Pro nezávaznou poptávku využijte náš komplexní formulář:
            </p>
            <a
              href="/pripravit-rozpocet"
              className="block w-full px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all"
            >
              Nezávazná poptávka
            </a>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold mb-4 text-gray-900">Nebo nás kontaktujte přímo:</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="flex items-center gap-3 text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">{siteConfig.contact.phone}</span>
                </a>
                <a
                  href="mailto:info@ac-heating.cz"
                  className="flex items-center gap-3 text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">info@ac-heating.cz</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pokrytí celé České republiky
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Poskytujeme instalace a servis tepelných čerpadel po celé ČR.
              Naši technici jsou připraveni vám pomoci kdekoli v republice.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
              <div className="p-4 bg-white rounded-lg shadow">Praha</div>
              <div className="p-4 bg-white rounded-lg shadow">Brno</div>
              <div className="p-4 bg-white rounded-lg shadow">Ostrava</div>
              <div className="p-4 bg-white rounded-lg shadow">Plzeň</div>
              <div className="p-4 bg-white rounded-lg shadow">Liberec</div>
              <div className="p-4 bg-white rounded-lg shadow">Olomouc</div>
              <div className="p-4 bg-white rounded-lg shadow">České Budějovice</div>
              <div className="p-4 bg-white rounded-lg shadow">Hradec Králové</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Máte otázky?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Navštivte naši sekci často kladených otázek nebo nás kontaktujte přímo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/faq"
              className="px-8 py-4 bg-white text-brand-primary border-2 border-brand-primary rounded-xl font-bold hover:bg-brand-primary hover:text-white transition-all"
            >
              Často kladené otázky
            </a>
            <a
              href="/blog"
              className="px-8 py-4 bg-brand-secondary text-white rounded-xl font-bold hover:bg-brand-secondary/90 transition-all"
            >
              Přečíst blog
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  content,
  link,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
  gradient: string;
}) {
  const Component = link ? 'a' : 'div';
  const props = link ? { href: link } : {};

  return (
    <Component
      {...props}
      className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 group"
    >
      <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 group-hover:text-brand-primary transition-colors">
          {content}
        </p>
      </div>
    </Component>
  );
}
