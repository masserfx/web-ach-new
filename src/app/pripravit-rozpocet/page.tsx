'use client';

import { useState } from 'next';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    console.log('Form data:', formData);
    setSubmitted(true);
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
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-brand-secondary to-green-600 text-white mb-6">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
              Děkujeme za vaši poptávku!
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Vaše nezávazná poptávka byla úspěšně odeslána. Náš tým vás bude
              kontaktovat do 24 hodin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
              >
                Zpět na homepage
              </a>
              <a
                href="/blog"
                className="px-8 py-4 bg-white text-brand-primary border-2 border-brand-primary rounded-xl font-bold hover:bg-brand-primary hover:text-white transition-all"
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
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Nezávazná poptávka
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
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
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Kontaktní údaje
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none transition-colors"
                        placeholder="Jan Novák"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none transition-colors"
                        placeholder="jan@example.com"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none transition-colors"
                      placeholder="+420 123 456 789"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Informace o projektu
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Typ nemovitosti *
                      </label>
                      <select
                        name="houseType"
                        required
                        value={formData.houseType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none transition-colors"
                      >
                        <option value="">Vyberte typ</option>
                        <option value="rodinny-dum">Rodinný dům</option>
                        <option value="bytovy-dum">Bytový dům</option>
                        <option value="komerci">Komerční objekt</option>
                        <option value="jine">Jiné</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vytápěná plocha (m²) *
                      </label>
                      <input
                        type="number"
                        name="area"
                        required
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none transition-colors"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Současné vytápění
                      </label>
                      <select
                        name="heating"
                        value={formData.heating}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none transition-colors"
                      >
                        <option value="">Vyberte typ</option>
                        <option value="elektrina">Elektřina</option>
                        <option value="plyn">Plyn</option>
                        <option value="uhli">Uhlí</option>
                        <option value="drevo">Dřevo</option>
                        <option value="jine">Jiné</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Poznámka
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none transition-colors resize-none"
                        placeholder="Zde můžete uvést další informace..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-brand-accent to-brand-accent/90 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Odeslat nezávaznou poptávku
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-4">
                    * Povinné pole
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl shadow-xl p-6 text-white">
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
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Nebo nás kontaktujte přímo
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+420123456789"
                  className="flex items-center gap-3 text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">+420 123 456 789</span>
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

            {/* Trust Indicators */}
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Proč nám věřit?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ 20 let zkušeností</li>
                <li>✓ 1000+ spokojených zákazníků</li>
                <li>✓ 7 let záruka</li>
                <li>✓ Vlastní servis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
