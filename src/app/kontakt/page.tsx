import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktujte AC Heating - tepelná čerpadla a fotovoltaika. Telefon, email, adresa. Jsme tu pro vás po celé ČR.',
};

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-carbon via-graphite to-carbon py-20">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-steel mb-6 leading-tight">
              Kontakt
            </h1>
            <p className="text-xl md:text-2xl text-steel-dim leading-relaxed">
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
            <h2 className="text-3xl font-bold mb-8 text-steel">Kontaktní údaje</h2>

            <ContactCard
              icon={<Phone className="w-6 h-6" />}
              title="Telefon"
              content={siteConfig.contact.phone}
              link={`tel:${siteConfig.contact.phoneRaw}`}
            />

            <ContactCard
              icon={<Mail className="w-6 h-6" />}
              title="Email"
              content="info@ac-heating.cz"
              link="mailto:info@ac-heating.cz"
            />

            <ContactCard
              icon={<MapPin className="w-6 h-6" />}
              title="Adresa"
              content="AC Heating s.r.o., Praha, Česká republika"
            />

            <ContactCard
              icon={<Clock className="w-6 h-6" />}
              title="Pracovní doba"
              content="Po-Pá: 8:00 - 17:00"
            />
          </div>

          {/* Quick Contact Form */}
          <div className="bg-graphite rounded-2xl shadow-xl p-8 border border-graphite-light/50">
            <h2 className="text-2xl font-bold mb-6 text-steel">Rychlý kontakt</h2>
            <p className="text-steel-dim mb-6">
              Pro nezávaznou poptávku využijte náš komplexní formulář:
            </p>
            <a
              href="/pripravit-rozpocet"
              className="block w-full px-6 py-4 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all"
            >
              Nezávazná poptávka
            </a>

            <div className="mt-8 pt-8 border-t border-graphite-light/50">
              <h3 className="font-bold mb-4 text-steel">Nebo nás kontaktujte přímo:</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="flex items-center gap-3 text-accent hover:text-accent/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">{siteConfig.contact.phone}</span>
                </a>
                <a
                  href="mailto:info@ac-heating.cz"
                  className="flex items-center gap-3 text-accent hover:text-accent/80 transition-colors"
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
      <section className="bg-graphite/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-steel">
              Pokrytí celé České republiky
            </h2>
            <p className="text-xl text-steel-dim mb-8">
              Poskytujeme instalace a servis tepelných čerpadel po celé ČR.
              Naši technici jsou připraveni vám pomoci kdekoli v republice.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-graphite rounded-lg shadow border border-graphite-light/50 hover:border-accent/50 transition-all text-steel-dim">Praha</div>
              <div className="p-4 bg-graphite rounded-lg shadow border border-graphite-light/50 hover:border-accent/50 transition-all text-steel-dim">Brno</div>
              <div className="p-4 bg-graphite rounded-lg shadow border border-graphite-light/50 hover:border-accent/50 transition-all text-steel-dim">Ostrava</div>
              <div className="p-4 bg-graphite rounded-lg shadow border border-graphite-light/50 hover:border-accent/50 transition-all text-steel-dim">Plzeň</div>
              <div className="p-4 bg-graphite rounded-lg shadow border border-graphite-light/50 hover:border-accent/50 transition-all text-steel-dim">Liberec</div>
              <div className="p-4 bg-graphite rounded-lg shadow border border-graphite-light/50 hover:border-accent/50 transition-all text-steel-dim">Olomouc</div>
              <div className="p-4 bg-graphite rounded-lg shadow border border-graphite-light/50 hover:border-accent/50 transition-all text-steel-dim">České Budějovice</div>
              <div className="p-4 bg-graphite rounded-lg shadow border border-graphite-light/50 hover:border-accent/50 transition-all text-steel-dim">Hradec Králové</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-steel">
            Máte otázky?
          </h2>
          <p className="text-xl text-steel-dim mb-8">
            Navštivte naši sekci často kladených otázek nebo nás kontaktujte přímo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/faq"
              className="px-8 py-4 bg-graphite text-accent border-2 border-accent rounded-xl font-bold hover:bg-accent hover:text-white transition-all"
            >
              Často kladené otázky
            </a>
            <a
              href="/blog"
              className="px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-all"
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
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
}) {
  const Component = link ? 'a' : 'div';
  const props = link ? { href: link } : {};

  return (
    <Component
      {...props}
      className="flex items-start gap-4 p-6 bg-graphite rounded-2xl shadow-lg hover:shadow-xl transition-all border border-graphite-light/50 hover:border-accent/50 group"
    >
      <div className="flex-shrink-0 p-3 rounded-xl bg-accent text-white">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-steel mb-1">{title}</h3>
        <p className="text-steel-dim group-hover:text-accent transition-colors">
          {content}
        </p>
      </div>
    </Component>
  );
}
