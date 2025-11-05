import { Metadata } from 'next';
import { Briefcase, MapPin, GraduationCap, Zap, Users, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kariéra - AC Heating',
  description: 'Pracujte s námi! AC Heating hledá zkušené profesionály pro pozice v instalaci, technice a správě projektů.',
  openGraph: {
    title: 'Kariéra - AC Heating',
    description: 'Nabízíme stabilní práci v dynamickém prostředí. Připojte se k našemu týmu odborníků v energetických řešeních.',
    type: 'website',
  },
};

export default function CareerPage() {
  const positions = [
    {
      title: 'Technik instalatér tepelných čerpadel',
      location: 'Praha, Brno, Plzeň',
      type: 'Full-time',
      description: 'Hledáme zkušené instalatéry s certifikací. Odpovídáte za instalaci a testování tepelných čerpadel.',
    },
    {
      title: 'Servisní technik',
      location: 'Různá místa',
      type: 'Full-time',
      description: 'Údržba a servis instalovaných systémů. Potřebujeme kouče s minimálně 3 roky zkušeností.',
    },
    {
      title: 'Projektový manažer',
      location: 'Praha',
      type: 'Full-time',
      description: 'Řídíte projekty instalace komplexních systémů. Komunikujete se zákazníky a koordinujete tým.',
    },
    {
      title: 'Elektrikář',
      location: 'Různá místa',
      type: 'Full-time',
      description: 'Elektrická instalace a připojení systémů. Potřebný průkaz o elektrotechnice.',
    },
    {
      title: 'Obchodní zástupce',
      location: 'Praha',
      type: 'Full-time',
      description: 'Prodej a poradenství pro korporátní klienty. Ambiciózní se znalostí energetiky.',
    },
    {
      title: 'Administrator podpory',
      location: 'Praha',
      type: 'Full-time',
      description: 'Technická podpora zákazníků. Odpovídáte na dotazy a řešíte problémy se systémy.',
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Stabilní příjem',
      description: 'Konkurenční plat a pravidelné zvýšení na základě výkonu.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Tým odborníků',
      description: 'Pracujete s lidmi, kteří rozumí oboru a snaží se být nejlepší.',
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Vzdělávání',
      description: 'Financujeme kurzy, školení a certifikace pro váš rozvoj.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Kariérní růst',
      description: 'Možnost se posunout do vedoucích pozic. Investujeme do svých zaměstnanců.',
    },
  ];

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
              Kariéra
            </h1>
            <p className="text-xl md:text-2xl text-steel-dim leading-relaxed">
              Hledáte práci v perspektivním oboru? AC Heating nabízí stabilní zaměstnání
              v dynamickém prostředí. Připojte se k našemu týmu a pomáhejte lidem šetřit energii.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
            Proč pracovat pro AC Heating?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-8 bg-graphite rounded-2xl shadow-lg border border-graphite-light/50 hover:border-accent/50 transition-all"
              >
                <div className="inline-flex p-3 rounded-lg bg-accent text-white mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-steel">{benefit.title}</h3>
                <p className="text-steel-dim leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="bg-graphite/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
              Volná místa
            </h2>

            {positions.length > 0 ? (
              <div className="space-y-6">
                {positions.map((position, idx) => (
                  <div
                    key={idx}
                    className="p-8 bg-graphite rounded-2xl shadow-lg border border-graphite-light/50 hover:border-accent/50 transition-all hover:shadow-xl"
                  >
                    <div className="grid md:grid-cols-3 gap-4 items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-steel mb-2">
                          {position.title}
                        </h3>
                        <p className="text-steel-dim">{position.description}</p>
                      </div>
                      <div className="md:text-right space-y-2">
                        <div className="flex items-center justify-start md:justify-end gap-2 text-steel-dim">
                          <MapPin className="w-5 h-5 flex-shrink-0" />
                          <span>{position.location}</span>
                        </div>
                        <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold border border-accent/30">
                          {position.type}
                        </div>
                      </div>
                      <div className="md:text-right">
                        <a
                          href="#contact"
                          className="inline-block px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
                        >
                          Zaslat CV
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-graphite rounded-2xl border border-graphite-light/50">
                <p className="text-steel-dim text-lg mb-6">
                  V tuto chvíli nejsou k dispozici žádná volná místa.
                </p>
                <p className="text-steel-dim">
                  Napište nám na <a href="mailto:kariera@ac-heating.cz" className="text-accent font-semibold hover:text-accent/80">kariera@ac-heating.cz</a> a
                  my vás budeme mít na mysli.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
            Jak se přihlásit?
          </h2>
          <div className="bg-graphite rounded-2xl shadow-lg border border-graphite-light/50 p-12">
            <p className="text-lg text-steel-dim mb-6">
              Máte zájem pracovat pro AC Heating? Pošlěte nám svůj životopis a motivační
              dopis na následující e-mailovou adresu:
            </p>
            <a
              href="mailto:kariera@ac-heating.cz"
              className="inline-block px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-colors mb-6"
            >
              kariera@ac-heating.cz
            </a>
            <p className="text-steel-dim">
              Odpovíme vám do 7 pracovních dnů. Budeme se těšit na váš zájem!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent to-accent-dark py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Chcete vědět více o AC Heating?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Podívejte se na naši společnost a zjistěte, proč jsme jedním z nejlepších zaměstnavatelů
            v oboru energetiky.
          </p>
          <Link
            href="/o-spolecnosti"
            className="inline-block px-10 py-5 bg-white text-accent rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
          >
            O společnosti
          </Link>
        </div>
      </section>
    </main>
  );
}
