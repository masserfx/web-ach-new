'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Home, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    houseType: '',
    area: '',
    heating: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Nepodařilo se odeslat poptávku');
      }

      console.log('Quote submitted successfully:', result);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting quote:', err);
      setError(err instanceof Error ? err.message : 'Došlo k chybě při odesílání');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <main id="main-content" className="min-h-screen bg-black flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-accent to-accent-dark text-white mb-6">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-steel">
              Děkujeme za vaši poptávku!
            </h1>
            <p className="text-xl text-steel-dim mb-8">
              Vaše nezávazná poptávka byla úspěšně odeslána. Náš tým vás bude
              kontaktovat do 24 hodin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-all"
              >
                Zpět na homepage
              </a>
              <a
                href="/blog"
                className="px-8 py-4 bg-graphite text-accent border-2 border-accent rounded-xl font-bold hover:bg-accent hover:text-white transition-all"
              >
                Přečíst blog
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
              Nezávazná poptávka
            </h1>
            <p className="text-xl md:text-2xl text-steel-dim leading-relaxed">
              Vyplňte formulář a my vám připravíme cenovou nabídku na míru.
              Bez závazků, zcela zdarma.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-graphite rounded-2xl shadow-xl p-8 border border-graphite-light/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-steel">
                    Kontaktní údaje
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-steel mb-2">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-carbon border-2 border-graphite-light/50 text-steel rounded-xl focus:border-accent focus:outline-none transition-colors"
                        placeholder="Jan Novák"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-steel mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-carbon border-2 border-graphite-light/50 text-steel rounded-xl focus:border-accent focus:outline-none transition-colors"
                        placeholder="jan@example.com"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-steel mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-carbon border-2 border-graphite-light/50 text-steel rounded-xl focus:border-accent focus:outline-none transition-colors"
                      placeholder="+420 123 456 789"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="pt-6 border-t border-graphite-light/50">
                  <h2 className="text-2xl font-bold mb-6 text-steel">
                    Informace o projektu
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-steel mb-2">
                        Typ nemovitosti *
                      </label>
                      <select
                        name="houseType"
                        required
                        value={formData.houseType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-carbon border-2 border-graphite-light/50 text-steel rounded-xl focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">Vyberte typ</option>
                        <option value="rodinny_dum">Rodinný dům</option>
                        <option value="bytovy_dum">Bytový dům</option>
                        <option value="firma">Komerční objekt</option>
                        <option value="developer">Jiné</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-steel mb-2">
                        Vytápěná plocha (m²) *
                      </label>
                      <input
                        type="number"
                        name="area"
                        required
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-carbon border-2 border-graphite-light/50 text-steel rounded-xl focus:border-accent focus:outline-none transition-colors"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-steel mb-2">
                        Současné vytápění
                      </label>
                      <select
                        name="heating"
                        value={formData.heating}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-carbon border-2 border-graphite-light/50 text-steel rounded-xl focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">Vyberte typ</option>
                        <option value="elektrina">Elektřina</option>
                        <option value="plyn">Plyn</option>
                        <option value="uhli">Uhlí</option>
                        <option value="drevo">Dřevo</option>
                        <option value="developer">Jiné</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-steel mb-2">
                        Poznámka
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-carbon border-2 border-graphite-light/50 text-steel rounded-xl focus:border-accent focus:outline-none transition-colors resize-none"
                        placeholder="Zde můžete uvést další informace..."
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-900/30 border-2 border-red-500/50 rounded-xl">
                    <p className="text-red-300 font-medium">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Odesílání...' : 'Odeslat nezávaznou poptávku'}
                  </button>
                  <p className="text-sm text-steel-dim text-center mt-4">
                    * Povinné pole
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl shadow-xl p-6 text-white border border-accent/30">
              <h3 className="text-xl font-bold mb-4">Co získáte?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Cenovou nabídku do 24 hodin</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Konzultaci zdarma</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Výpočet dotací</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Doporučení na míru</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-graphite rounded-2xl shadow-xl p-6 border border-graphite-light/50">
              <h3 className="text-xl font-bold mb-4 text-steel">
                Nebo nás kontaktujte přímo
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+420123456789"
                  className="flex items-center gap-3 text-accent hover:text-accent/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">+420 123 456 789</span>
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

            {/* Trust Indicators */}
            <div className="bg-graphite/50 rounded-2xl p-6 border border-graphite-light/50">
              <h3 className="text-lg font-bold mb-4 text-steel">
                Proč nám věřit?
              </h3>
              <ul className="space-y-2 text-sm text-steel-dim">
                <li>✓ 18+ let zkušeností</li>
                <li>✓ 7500+ domácností po Evropě</li>
                <li>✓ 7 let záruka</li>
                <li>✓ 24/7 servis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
