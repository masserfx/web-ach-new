import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů (GDPR) | AC Heating',
  description: 'Zásady ochrany osobních údajů společnosti AC Heating s.r.o. v souladu s GDPR.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na homepage
        </Link>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900">
                Ochrana osobních údajů
              </h1>
              <p className="text-gray-600 mt-2">
                Platné od 1. 1. 2024 | V souladu s GDPR
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-12">
          <div className="prose prose-lg max-w-none">
            <h2>1. Správce osobních údajů</h2>
            <p>
              Správcem vašich osobních údajů je společnost <strong>{siteConfig.company.name}</strong>, 
              se sídlem {siteConfig.contact.address.full}, 
              IČO: {siteConfig.company.ico}, 
              zapsaná v obchodním rejstříku vedeném {siteConfig.company.registeredAt}.
            </p>
            <p>
              Kontaktní údaje:<br />
              Email: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><br />
              Telefon: <a href={`tel:${siteConfig.contact.phoneRaw}`}>{siteConfig.contact.phone}</a>
            </p>

            <h2>2. Jaké osobní údaje zpracováváme</h2>
            <p>Zpracováváme následující kategorie osobních údajů:</p>
            <ul>
              <li><strong>Identifikační údaje:</strong> Jméno, příjmení</li>
              <li><strong>Kontaktní údaje:</strong> Email, telefonní číslo, adresa</li>
              <li><strong>Údaje o poptávce:</strong> Typ služby, předmět dotazu, zpráva</li>
              <li><strong>Technické údaje:</strong> IP adresa, cookies, typ zařízení</li>
            </ul>

            <h2>3. Účel zpracování osobních údajů</h2>
            <p>Vaše osobní údaje zpracováváme pro následující účely:</p>
            <ul>
              <li><strong>Vyřízení poptávky:</strong> Abychom vás mohli kontaktovat a připravit cenovou nabídku</li>
              <li><strong>Plnění smlouvy:</strong> Instalace, servis, fakturace</li>
              <li><strong>Marketing:</strong> Zasílání newsletteru (pouze s vaším souhlasem)</li>
              <li><strong>Zlepšení služeb:</strong> Analýza návštěvnosti webu (Google Analytics)</li>
              <li><strong>Právní povinnosti:</strong> Účetnictví, daňová evidence</li>
            </ul>

            <h2>4. Právní základ zpracování</h2>
            <p>Vaše osobní údaje zpracováváme na základě:</p>
            <ul>
              <li><strong>Plnění smlouvy:</strong> Čl. 6 odst. 1 písm. b) GDPR</li>
              <li><strong>Váš souhlas:</strong> Čl. 6 odst. 1 písm. a) GDPR (newsletter, marketing)</li>
              <li><strong>Právní povinnost:</strong> Čl. 6 odst. 1 písm. c) GDPR (účetnictví)</li>
              <li><strong>Oprávněný zájem:</strong> Čl. 6 odst. 1 písm. f) GDPR (ochrana majetku)</li>
            </ul>

            <h2>5. Doba uchování osobních údajů</h2>
            <ul>
              <li><strong>Poptávky:</strong> 3 roky od posledního kontaktu</li>
              <li><strong>Smlouvy:</strong> 10 let od ukončení smlouvy (daňová povinnost)</li>
              <li><strong>Newsletter:</strong> Do odvolání souhlasu</li>
              <li><strong>Cookies:</strong> 2 roky</li>
            </ul>

            <h2>6. Příjemci osobních údajů</h2>
            <p>Vaše osobní údaje můžeme předat třetím stranám:</p>
            <ul>
              <li><strong>Subdodavatelé:</strong> Instalační firmy (jen v nutném rozsahu)</li>
              <li><strong>Účetní:</strong> Pro zpracování účetnictví</li>
              <li><strong>Hosting:</strong> Supabase (EU servery)</li>
              <li><strong>Email služby:</strong> Pro zasílání emailů</li>
            </ul>
            <p>Všichni příjemci jsou smluvně zavázáni chránit vaše osobní údaje.</p>

            <h2>7. Vaše práva</h2>
            <p>Máte následující práva:</p>
            <ul>
              <li><strong>Právo na přístup:</strong> Získat kopii vašich osobních údajů</li>
              <li><strong>Právo na opravu:</strong> Opravit nesprávné údaje</li>
              <li><strong>Právo na výmaz:</strong> Požádat o smazání vašich údajů</li>
              <li><strong>Právo na omezení:</strong> Omezit zpracování</li>
              <li><strong>Právo na přenositelnost:</strong> Získat údaje v elektronické podobě</li>
              <li><strong>Právo vznést námitku:</strong> Proti zpracování pro marketing</li>
              <li><strong>Právo odvolat souhlas:</strong> Kdykoliv bez důvodu</li>
            </ul>
            <p>
              Pro uplatnění práv nás kontaktujte na: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            </p>

            <h2>8. Cookies</h2>
            <p>Náš web používá cookies pro:</p>
            <ul>
              <li><strong>Nezbytné cookies:</strong> Fungování webu (nelze odmítnout)</li>
              <li><strong>Analytické cookies:</strong> Google Analytics (můžete odmítnout)</li>
              <li><strong>Marketingové cookies:</strong> Remarketing (můžete odmítnout)</li>
            </ul>
            <p>
              Správu cookies můžete provést v nastavení vašeho prohlížeče nebo pomocí cookie lišty.
            </p>

            <h2>9. Zabezpečení</h2>
            <p>
              Používáme technická a organizační opatření k ochraně vašich osobních údajů:
            </p>
            <ul>
              <li>SSL/TLS šifrování</li>
              <li>Bezpečné datové úložiště (Supabase)</li>
              <li>Pravidelné zálohy</li>
              <li>Omezený přístup zaměstnanců</li>
              <li>Pravidelné bezpečnostní audity</li>
            </ul>

            <h2>10. Stížnost u dozorového úřadu</h2>
            <p>
              Pokud si myslíte, že zpracování vašich osobních údajů porušuje GDPR, 
              máte právo podat stížnost u dozorového úřadu:
            </p>
            <p>
              <strong>Úřad pro ochranu osobních údajů</strong><br />
              Pplk. Sochora 27<br />
              170 00 Praha 7<br />
              Web: <a href="https://www.uoou.cz" target="_blank" rel="noopener">www.uoou.cz</a>
            </p>

            <h2>11. Změny těchto zásad</h2>
            <p>
              Tyto zásady můžeme čas od času aktualizovat. O významných změnách vás budeme 
              informovat prostřednictvím webu nebo emailem.
            </p>

            <h2>12. Kontakt</h2>
            <p>
              Pro dotazy ohledně ochrany osobních údajů nás kontaktujte:
            </p>
            <p>
              Email: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><br />
              Telefon: <a href={`tel:${siteConfig.contact.phoneRaw}`}>{siteConfig.contact.phone}</a><br />
              Adresa: {siteConfig.contact.address.full}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
