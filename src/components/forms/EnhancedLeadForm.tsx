'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Building2, Home, CheckCircle2, Loader2, MapPin, User, AlertCircle } from 'lucide-react';

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

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  propertyType?: string;
  gdprConsent?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});

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
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Jméno je povinné';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Příjmení je povinné';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon je povinný';
    } else if (!/^[\d\s+()-]{9,}$/.test(formData.phone)) {
      newErrors.phone = 'Neplatný formát telefonu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.propertyType) {
      newErrors.propertyType = 'Vyberte typ objektu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!formData.gdprConsent) {
      setErrors({ gdprConsent: 'Musíte souhlasit se zpracováním osobních údajů' });
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
              <label htmlFor="lead-firstName" className="block text-sm font-medium text-zinc-700 mb-2">
                Jméno *
              </label>
              <input
                id="lead-firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                  errors.firstName 
                    ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                    : 'border-zinc-300 focus:ring-2 focus:ring-red-600 focus:border-transparent'
                }`}
                placeholder="Jan"
                required
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="lead-lastName" className="block text-sm font-medium text-zinc-700 mb-2">
                Příjmení *
              </label>
              <input
                id="lead-lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                  errors.lastName 
                    ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                    : 'border-zinc-300 focus:ring-2 focus:ring-red-600 focus:border-transparent'
                }`}
                placeholder="Novák"
                required
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="lead-email" className="block text-sm font-medium text-zinc-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
              <input
                id="lead-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${
                  errors.email 
                    ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                    : 'border-zinc-300 focus:ring-2 focus:ring-red-600 focus:border-transparent'
                }`}
                placeholder="jan.novak@email.cz"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lead-phone" className="block text-sm font-medium text-zinc-700 mb-2">
              Telefon *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${
                  errors.phone 
                    ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                    : 'border-zinc-300 focus:ring-2 focus:ring-red-600 focus:border-transparent'
                }`}
                placeholder="+420 123 456 789"
                required
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lead-city" className="block text-sm font-medium text-zinc-700 mb-2">
              Město
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
              <input
                id="lead-city"
                name="city"
                type="text"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Praha"
                autoComplete="address-level2"
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
                      : errors.propertyType
                      ? 'border-red-500 bg-red-50'
                      : 'border-zinc-300 hover:border-red-300'
                  }`}
                  aria-pressed={formData.propertyType === type.value}
                >
                  <type.icon className="w-6 h-6 mb-2 text-red-600" />
                  <div className="font-semibold">{type.label}</div>
                </button>
              ))}
            </div>
            {errors.propertyType && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.propertyType}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lead-propertySize" className="block text-sm font-medium text-zinc-700 mb-2">
              Plocha objektu (m²)
            </label>
            <input
              id="lead-propertySize"
              name="propertySize"
              type="number"
              value={formData.propertySize || ''}
              onChange={(e) => updateField('propertySize', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="150"
            />
          </div>

          <div>
            <label htmlFor="lead-budgetRange" className="block text-sm font-medium text-zinc-700 mb-2">
              Rozpočet
            </label>
            <select
              id="lead-budgetRange"
              name="budgetRange"
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
            <label htmlFor="lead-urgency" className="block text-sm font-medium text-zinc-700 mb-2">
              Časový rámec
            </label>
            <select
              id="lead-urgency"
              name="urgency"
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
            <label htmlFor="lead-projectDescription" className="block text-sm font-medium text-zinc-700 mb-2">
              Popis projektu
            </label>
            <textarea
              id="lead-projectDescription"
              name="projectDescription"
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
          
          <div className={`bg-zinc-50 border rounded-lg p-6 ${errors.gdprConsent ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.gdprConsent}
                  onChange={(e) => updateField('gdprConsent', e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-600"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.gdprConsent}
                  aria-describedby={errors.gdprConsent ? 'gdprConsent-error' : undefined}
                />
                <span className="text-sm text-zinc-700">
                  Souhlasím se zpracováním osobních údajů za účelem zpracování poptávky a kontaktování. *
                </span>
              </label>
              {errors.gdprConsent && (
                <p id="gdprConsent-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gdprConsent}
                </p>
              )}

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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
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
            onClick={handleNext}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            Pokračovat
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isStepValid() || isSubmitting}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
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
