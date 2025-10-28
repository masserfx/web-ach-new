'use client';

import { motion } from 'framer-motion';
import { FileText, Calculator, Wrench, CheckCircle, Phone, Calendar } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Nezávazná poptávka',
    description: 'Vyplňte poptávkový formulář nebo nás kontaktujte telefonicky. Do 24 hodin vás budeme kontaktovat.',
    icon: Phone,
    duration: '24 hodin',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Osobní konzultace',
    description: 'Navštívíme vás na místě, provedeme odbornou konzultaci a připravíme cenovou nabídku na míru.',
    icon: FileText,
    duration: '3-7 dní',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 3,
    title: 'Kalkulace a dotace',
    description: 'Připravíme detailní kalkulaci včetně možných dotací. Pomůžeme s vyřízením dotační žádosti.',
    icon: Calculator,
    duration: '7-14 dní',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 4,
    title: 'Podpis smlouvy',
    description: 'Po odsouhlasení nabídky podepíšeme smlouvu o dílo a naplánujeme termín instalace.',
    icon: Calendar,
    duration: '1 den',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 5,
    title: 'Instalace',
    description: 'Náš zkušený tým provede profesionální instalaci podle dohodnutého plánu. Standardní instalace trvá 2-3 dny.',
    icon: Wrench,
    duration: '2-3 dny',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 6,
    title: 'Uvedení do provozu',
    description: 'Zařízení uvedeme do provozu, provedeme zaškolení a předáme záruční list. Jste připraveni šetřit!',
    icon: CheckCircle,
    duration: '1 den',
    color: 'from-green-500 to-green-600',
  },
];

export function InstallationProcess() {
  return (
    <section className="py-20 bg-carbon">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Jak probíhá instalace?
          </h2>
          <p className="text-xl text-steel-dim max-w-3xl mx-auto">
            Celý proces od první poptávky po uvedení do provozu zabere průměrně 4-6 týdnů
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-12 top-24 w-0.5 h-32 bg-gradient-to-b from-accent/20 to-accent/5" />
                )}

                {/* Step Card */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 md:mb-16">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow bg-gradient-to-br from-graphite-light to-carbon rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-bold rounded-full mb-2">
                          Krok {step.id}
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {step.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-steel">Časová náročnost</span>
                        <p className="font-bold text-accent">{step.duration}</p>
                      </div>
                    </div>
                    <p className="text-steel-dim leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/pripravit-rozpocet"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-accent to-accent/90 text-white rounded-lg font-bold text-lg hover:from-accent/90 hover:to-accent shadow-xl hover:shadow-2xl transition-all"
          >
            Začít proces instalace
            <CheckCircle className="w-5 h-5" />
          </a>
          <p className="text-steel-dim mt-4">
            Nebo nás kontaktujte na <a href="tel:+420731402055" className="text-accent hover:underline">+420 731 402 055</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
