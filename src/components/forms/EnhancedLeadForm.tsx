'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Building2, Home, CheckCircle2, Loader2, MapPin, User } from 'lucide-react';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: 'rodinny_dum' | 'bytovy_dum' | 'firma' | 'developer' | '';
  propertySize?: number;
  city?: string;
  projectDescription?: string;
  interestedProducts: string[];
  budgetRange?: string;
  urgency: 'immediate' | 'this_month' | 'this_quarter' | 'planning' | '';
  gdprConsent: boolean;
  marketingConsent: boolean;
}

interface EnhancedLeadFormProps {
  preselectedProduct?: string;
  source?: string;
}

export function EnhancedLeadForm({ preselectedProduct, source = 'website' }: EnhancedLeadFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: '',
    city: '',
    projectDescription: '',
    interestedProducts: preselectedProduct ? [preselectedProduct] : [],
    budgetRange: '',
    urgency: '',
    gdprConsent: false,
    marketingConsent: false,
  });

  const updateField = (field: keyof LeadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.email && formData.phone;
    }
    if (step === 2) {
      return formData.propertyType;
    }
    if (step === 3) {
      return formData.gdprConsent;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.gdprConsent) {
      setError('Musíte souhlasit se zpracováním osobních údajů');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          leadType: 'quote_request',
          source,
          consentIp: typeof window !== 'undefined' ? window.location.hostname : '',
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Nepodařilo se odeslat poptávku');
      }

      setIsSuccess(true);
      
      // Redirect po 2 sekundách
      setTimeout(() => {
        router.push('/dekujeme');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Došlo k chybě při odesílání');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Děkujeme za poptávku!</h2>
        <p className="text-zinc-600">
          Ozveme se vám do 24 hodin.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full mx-1 ${
                s <= step ? 'bg-red-600' : 'bg-zinc-200'
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-zinc-600 text-center">
          Krok {step} ze 3
        </div>
      </div>

      {/* Step 1: Contact Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-900 mb-4">Kontaktní údaje</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Jméno *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Jan"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Příjmení *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Novák"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="jan.novak@email.cz"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Telefon *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="+420 123 456 789"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Město
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Praha"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Property Info */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-900 mb-4">Informace o objektu</h3>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-3">
              Typ objektu *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'rodinny_dum', label: 'Rodinný dům', icon: Home },
                { value: 'bytovy_dum', label: 'Bytový dům', icon: Building2 },
                { value: 'firma', label: 'Firma', icon: Building2 },
                { value: 'developer', label: 'Developer', icon: Building2 },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateField('propertyType', type.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.propertyType === type.value
                      ? 'border-red-600 bg-red-50'
                      : 'border-zinc-300 hover:border-red-300'
                  }`}
                >
                  <type.icon className="w-6 h-6 mb-2 text-red-600" />
                  <div className="font-semibold">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Plocha objektu (m²)
            </label>
            <input
              type="number"
              value={formData.propertySize || ''}
              onChange={(e) => updateField('propertySize', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Rozpočet
            </label>
            <select
              value={formData.budgetRange}
              onChange={(e) => updateField('budgetRange', e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="">Vyberte rozpočet</option>
              <option value="do-500k">Do 500 000 Kč</option>
              <option value="500k-1m">500 000 - 1 000 000 Kč</option>
              <option value="1m-2m">1 000 000 - 2 000 000 Kč</option>
              <option value="2m+">Nad 2 000 000 Kč</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Časový rámec
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => updateField('urgency', e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="">Vyberte časový rámec</option>
              <option value="immediate">Co nejdříve</option>
              <option value="this_month">Tento měsíc</option>
              <option value="this_quarter">Toto čtvrtletí</option>
              <option value="planning">Plánuji do budoucna</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Popis projektu
            </label>
            <textarea
              value={formData.projectDescription}
              onChange={(e) => updateField('projectDescription', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Popište vaše požadavky..."
            />
          </div>
        </div>
      )}

      {/* Step 3: Consent */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-900 mb-4">Souhlas se zpracováním</h3>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.gdprConsent}
                  onChange={(e) => updateField('gdprConsent', e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-600"
                  required
                />
                <span className="text-sm text-zinc-700">
                  Souhlasím se zpracováním osobních údajů za účelem zpracování poptávky a kontaktování. *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.marketingConsent}
                  onChange={(e) => updateField('marketingConsent', e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-600"
                />
                <span className="text-sm text-zinc-700">
                  Souhlasím se zasíláním obchodních sdělení a novinek.
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
            disabled={isSubmitting}
          >
            Zpět
          </button>
        )}
        
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!isStepValid()}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            Pokračovat
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isStepValid() || isSubmitting}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Odesílám...
              </>
            ) : (
              'Odeslat poptávku'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
