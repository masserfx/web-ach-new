import { Metadata } from 'next';
import { Award, Users, Target, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'O nás',
  description: 'AC Heating je česká firma s 20 lety zkušeností v oblasti tepelných čerpadel. Vlastní vývoj, výroba a servis po celé ČR.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                O nás
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Jsme česká firma s vlastním vývojem, výrobou a servisem tepelných čerpadel.
              Již 20 let pomáháme rodinám i firmám šetřit energie a chránit životní prostředí.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Náš příběh
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              AC Heating vznikl v roce 2004 s jasnou vizí - přinést české domácnosti
              moderní a ekologické řešení vytápění. Za více než 20 let na trhu jsme
              realizovali přes 1000 instalací a stali se jedním z předních výrobců
              tepelných čerpadel v České republice.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Naše tepelná čerpadla vyvíjíme a vyrábíme výhradně v České republice,
              což nám umožňuje garantovat nejvyšší kvalitu a poskytovat komplexní
              servis po celé ČR. Důraz klademe na inovace, kvalitu a spokojenost
              našich zákazníků.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Naše hodnoty
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <ValueCard
              icon={<Award className="w-12 h-12" />}
              title="Kvalita"
              description="7 let záruka na všechny naše produkty. Česká výroba s nejvyššími standardy."
              gradient="from-brand-accent to-orange-600"
            />
            <ValueCard
              icon={<Users className="w-12 h-12" />}
              title="Zkušenosti"
              description="Přes 20 let na trhu a více než 1000 úspěšných instalací po celé ČR."
              gradient="from-brand-primary to-amber-700"
            />
            <ValueCard
              icon={<Target className="w-12 h-12" />}
              title="Inovace"
              description="Vlastní výzkum a vývoj. Neustále zlepšujeme naše technologie."
              gradient="from-brand-secondary to-green-600"
            />
            <ValueCard
              icon={<Heart className="w-12 h-12" />}
              title="Péče"
              description="Komplexní servis a podpora. Jsme tu pro vás i po instalaci."
              gradient="from-purple-600 to-pink-600"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Čísla o nás
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="20+" label="Let na trhu" />
            <StatCard number="1000+" label="Instalací" />
            <StatCard number="7" label="Let záruka" />
            <StatCard number="100%" label="Česká výroba" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Chcete vědět více?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rádi vám poradíme s výběrem správného řešení pro váš domov nebo firmu.
          </p>
          <a
            href="/kontakt"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-brand-primary rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
          >
            Kontaktujte nás
          </a>
        </div>
      </section>
    </main>
  );
}

function ValueCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 group">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
      <div className="text-4xl md:text-5xl font-black text-brand-primary mb-2">
        {number}
      </div>
      <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
