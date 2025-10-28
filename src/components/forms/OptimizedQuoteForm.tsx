'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Home, Zap } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface FormStep {
  id: number;
  title: string;
  fields: string[];
}

const formSteps: FormStep[] = [
  {
    id: 1,
    title: 'Základní info',
    fields: ['firstName', 'email', 'phone'],
  },
  {
    id: 2,
    title: 'O tvém domě',
    fields: ['houseType', 'squareMeters', 'currentHeating'],
  },
  {
    id: 3,
    title: 'Tvoje zájmy',
    fields: ['interested', 'timeline', 'notes'],
  },
];

export function OptimizedQuoteForm({ compact = false }: { compact?: boolean }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    houseType: 'family-house',
    squareMeters: 150,
    currentHeating: 'gas',
    interested: [] as string[],
    timeline: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interested: prev.interested.includes(value)
        ? prev.interested.filter((item) => item !== value)
        : [...prev.interested, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            firstName: '',
            email: '',
            phone: '',
            houseType: 'family-house',
            squareMeters: 150,
            currentHeating: 'gas',
            interested: [],
            timeline: '',
            notes: '',
          });
          setCurrentStep(1);
          setSubmitted(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex p-4 rounded-full bg-green-100 text-green-600 mb-4">
          <Zap className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Děkujeme!</h3>
        <p className="text-steel mb-4">Tvou poptávku jsme obdrželi. Brzy ti zavoláme!</p>
        <p className="text-sm text-steel-dim">Okno se zavře za chvíli...</p>
      </div>
    );
  }

  const currentFormStep = formSteps.find((step) => step.id === currentStep);
  const progressPercentage = (currentStep / formSteps.length) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-steel">
            Krok {currentStep} z {formSteps.length}
          </span>
          <span className="text-sm font-semibold text-steel">{currentFormStep?.title}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-dark transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step 1: Základní info */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Jméno *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Petr"
              required
              className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="petr@example.com"
              required
              className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Telefon *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+420 XXX XXX XXX"
              required
              className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      )}

      {/* Step 2: O tvém domě */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              <Home className="w-4 h-4 inline mr-2" />
              Typ domu
            </label>
            <select
              name="houseType"
              value={formData.houseType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:outline-none focus:border-accent"
            >
              <option value="family-house">Rodinný dům</option>
              <option value="apartment">Byt/Apartmán</option>
              <option value="business">Podnikání/Komerční</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Velikost: <span className="text-accent">{formData.squareMeters} m²</span>
            </label>
            <input
              type="range"
              name="squareMeters"
              min="50"
              max="500"
              step="10"
              value={formData.squareMeters}
              onChange={handleInputChange}
              className="w-full accent-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              <Zap className="w-4 h-4 inline mr-2" />
              Aktuální vytápění
            </label>
            <select
              name="currentHeating"
              value={formData.currentHeating}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:outline-none focus:border-accent"
            >
              <option value="gas">Zemní plyn</option>
              <option value="oil">Topný olej</option>
              <option value="coal">Tuhá paliva</option>
              <option value="electric">Elektřina</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Tvoje zájmy */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Co tě zajímá?
            </label>
            <div className="space-y-2">
              {[
                { value: 'heat-pump', label: 'Tepelné čerpadlo' },
                { value: 'photovoltaic', label: 'Fotovoltaika' },
                { value: 'regulation', label: 'Regulace xCC' },
                { value: 'dotace', label: 'Dotace & financování' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interested.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                    className="w-4 h-4 rounded accent-accent"
                  />
                  <span className="text-steel">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Časový horizont
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:outline-none focus:border-accent"
            >
              <option value="">-- Vybrat --</option>
              <option value="urgent">Hned (během měsíce)</option>
              <option value="soon">Brzy (3-6 měsíců)</option>
              <option value="planning">Plánuji (6-12 měsíců)</option>
              <option value="exploring">Jen se dívám</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Poznámka
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Co bys nám rád(a) sdělil(a)?"
              rows={3}
              className="w-full px-4 py-2 border-2 border-white/10 rounded-lg focus:outline-none focus:border-accent resize-none"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1 px-6 py-2 border-2 border-white/20 text-white rounded-lg font-semibold hover:bg-graphite-light transition-colors"
          >
            ← Zpět
          </button>
        )}

        {currentStep < formSteps.length ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex-1 px-6 py-2 bg-gradient-to-r from-accent to-accent-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Dál →
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-gradient-to-r from-accent to-accent-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Odesílám...' : 'Odeslat poptávku'}
          </button>
        )}
      </div>

      <p className="text-xs text-steel-dim text-center">
        Tvoje data budeme používat jen k odpovědi na tvou poptávku.
      </p>
    </form>
  );
}
