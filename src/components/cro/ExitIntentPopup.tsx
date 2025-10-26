'use client';

import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import Link from 'next/link';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show popup when user tries to leave (exit intent)
    const handleMouseLeave = () => {
      setIsVisible(true);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in scale-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 text-white relative">
          <button
            onClick={() => {
              setIsVisible(false);
              setIsDismissed(true);
            }}
            className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-start gap-3">
            <div className="inline-flex p-3 rounded-full bg-white/20">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Počkej!</h3>
              <p className="text-white/90 text-sm">Máme pro tebe speciální nabídku</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Spočítej si úsporu zdarma!</h4>
            <p className="text-sm text-gray-700">
              Vezmi si náš kalkulátor a zjisti, kolik ročně ušetříš na topení.
            </p>
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Bezplatný odhad bez zavázání se</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Odpověď do 24 hodin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Informace o dostupných dotacích</span>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <Link
              href="/pripravit-rozpocet"
              className="block w-full py-3 px-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg font-bold text-center hover:shadow-lg transition-all"
            >
              Chci bezplatný odhad
            </Link>
            <button
              onClick={() => {
                setIsVisible(false);
                setIsDismissed(true);
              }}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              Možná později
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            Jsme specialisté na tepelná čerpadla od roku 2006. 7500+ spokojených zákazníků.
          </p>
        </div>
      </div>
    </div>
  );
}
