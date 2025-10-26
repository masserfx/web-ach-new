import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';

export const metadata: Metadata = {
  title: 'Obchodní podmínky | AC Heating',
  description: 'Všeobecné obchodní podmínky společnosti AC Heating s.r.o. pro instalaci tepelných čerpadel, klimatizací a fotovoltaiky.',
};

export default function TermsPage() {
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
              <FileText className="w-8 h-8 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900">
                Obchodní podmínky
              </h1>
              <p className="text-gray-600 mt-2">
                Platné od 1. 1. 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-12">
          <div className="prose prose-lg max-w-none">
            <h2>1. Úvodní ustanovení</h2>
            <p>
              Tyto všeobecné obchodní podmínky (dále jen "VOP") upravují vztahy mezi společností{' '}
              <strong>{siteConfig.company.name}</strong>, se sídlem {siteConfig.contact.address.full}, 
              IČO: {siteConfig.company.ico}, DIČ: {siteConfig.company.dic} (dále jen "dodavatel") 
              a zákazníkem při poskytování služeb instalace tepelných čerpadel, klimatizací, fotovoltaiky a souvisejících služeb.
            </p>

            <h2>2. Předmět smlouvy</h2>
            <p>Předmětem smlouvy je:</p>
            <ul>
              <li>Dodávka a instalace tepelných čerpadel, klimatizací nebo fotovoltaických systémů</li>
              <li>Uvedení zařízení do provozu</li>
              <li>Zaškolení zákazníka</li>
              <li>Poskytnutí záruky a servisu</li>
              <li>Pomoc s vyřízením dotací (volitelně)</li>
            </ul>

            <h2>3. Cenová nabídka a objednávka</h2>
            <p>
              <strong>3.1</strong> Cenová nabídka je platná 30 dnů od vystavení, pokud není uvedeno jinak.
            </p>
            <p>
              <strong>3.2</strong> Objednávka vzniká podpisem smlouvy o dílo oběma stranami.
            </p>
            <p>
              <strong>3.3</strong> Cena zahrnuje dopravu, instalaci, uvedení do provozu a základní zaškolení.
            </p>
            <p>
              <strong>3.4</strong> Cena nezahrnuje stavební práce, elektroinstalaci (pokud není výslovně uvedeno) a případné úpravy rozvodu topení.
            </p>

            <h2>4. Platební podmínky</h2>
            <p>
              <strong>4.1</strong> Záloha: 40% z celkové ceny při podpisu smlouvy<br />
              <strong>4.2</strong> Doplatek: 60% při dokončení instalace a předání díla<br />
              <strong>4.3</strong> Splatnost faktury: 14 dní od vystavení<br />
              <strong>4.4</strong> Způsob platby: Bankovní převod nebo hotově
            </p>

            <h2>5. Termín dodání a instalace</h2>
            <p>
              <strong>5.1</strong> Termín instalace bude dohodnut individuálně, obvykle 2-6 týdnů od podpisu smlouvy.
            </p>
            <p>
              <strong>5.2</strong> Standardní instalace trvá 2-3 pracovní dny v závislosti na složitosti.
            </p>
            <p>
              <strong>5.3</strong> Dodavatel informuje zákazníka o konkrétním termínu minimálně 7 dní předem.
            </p>
            <p>
              <strong>5.4</strong> Zákazník zajistí přístup k místu instalace a připojení k elektřině a vodě.
            </p>

            <h2>6. Záruka</h2>
            <p>
              <strong>6.1</strong> Záruka na zařízení: {siteConfig.features.warrantyYears} let<br />
              <strong>6.2</strong> Záruka na instalaci: 5 let<br />
              <strong>6.3</strong> Záruční list bude předán při dokončení instalace
            </p>
            <p>
              <strong>6.4</strong> Záruka se nevztahuje na:
            </p>
            <ul>
              <li>Poškození způsobené neodborným zásahem třetí strany</li>
              <li>Poškození živelnou pohromou</li>
              <li>Nedodržení provozních pokynů</li>
              <li>Neprovádění pravidelné údržby</li>
            </ul>

            <h2>7. Servis a údržba</h2>
            <p>
              <strong>7.1</strong> Doporučujeme pravidelnou roční kontrolu pro zachování záruky.
            </p>
            <p>
              <strong>7.2</strong> Servisní zásah provedeme do 48 hodin od nahlášení (v pracovní dny).
            </p>
            <p>
              <strong>7.3</strong> První roční kontrola je zdarma.
            </p>
            <p>
              <strong>7.4</strong> Nabízíme servisní smlouvy s pravidelnou údržbou a prioritním servisem.
            </p>

            <h2>8. Odstoupení od smlouvy</h2>
            <p>
              <strong>8.1 Zákazník může odstoupit:</strong>
            </p>
            <ul>
              <li>Do 14 dnů od podpisu bez udání důvodu (záloh a se nebude vracet)</li>
              <li>Při prodlení dodavatele více než 30 dnů</li>
              <li>Při podstatném porušení smlouvy dodavatelem</li>
            </ul>
            <p>
              <strong>8.2 Dodavatel může odstoupit:</strong>
            </p>
            <ul>
              <li>Při nezaplacení zálohy ve lhůtě 14 dnů</li>
              <li>Při nemožnosti instalace z technických důvodů</li>
              <li>Při podstatném porušení smlouvy zákazníkem</li>
            </ul>

            <h2>9. Reklamace</h2>
            <p>
              <strong>9.1</strong> Reklamaci uplatněte písemně na email: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> nebo telefonicky: <a href={`tel:${siteConfig.contact.phoneRaw}`}>{siteConfig.contact.phone}</a>
            </p>
            <p>
              <strong>9.2</strong> Uveďte popis vady, datum zjištění a požadovaný způsob vyřízení.
            </p>
            <p>
              <strong>9.3</strong> Reklamaci vyřídíme do 30 dnů od uplatnění.
            </p>
            <p>
              <strong>9.4</strong> Oprávněné reklamace řešíme bezplatně.
            </p>

            <h2>10. Dotace</h2>
            <p>
              <strong>10.1</strong> Pomáháme s vyřízením dotací v rámci programu Nová zelená úsporám.
            </p>
            <p>
              <strong>10.2</strong> Schválení dotace není garantováno a závisí na rozhodnutí dotačního orgánu.
            </p>
            <p>
              <strong>10.3</strong> V případě neschválení dotace zůstává smlouva v platnosti.
            </p>
            <p>
              <strong>10.4</strong> Poplatek za zpracování žádosti o dotaci je 5 000 Kč.
            </p>

            <h2>11. Odpovědnost za škodu</h2>
            <p>
              <strong>11.1</strong> Dodavatel odpovídá za škodu způsobenou při instalaci.
            </p>
            <p>
              <strong>11.2</strong> Dodavatel neodpovídá za skryté vady stavby zjištěné při instalaci.
            </p>
            <p>
              <strong>11.3</strong> Zákazník odpovídá za správnost informací poskytnutých dodavateli.
            </p>

            <h2>12. Ochrana osobních údajů</h2>
            <p>
              Zpracování osobních údajů se řídí samostatným dokumentem{' '}
              <Link href="/privacy" className="text-brand-primary hover:underline">
                Zásady ochrany osobních údajů (GDPR)
              </Link>.
            </p>

            <h2>13. Závěrečná ustanovení</h2>
            <p>
              <strong>13.1</strong> Tyto VOP jsou nedílnou součástí smlouvy o dílo.
            </p>
            <p>
              <strong>13.2</strong> Změny smlouvy musí být provedeny písemnou formou.
            </p>
            <p>
              <strong>13.3</strong> Vztahy neupravené těmito VOP se řídí českým právním řádem.
            </p>
            <p>
              <strong>13.4</strong> Spory budou řešeny českými soudy.
            </p>

            <h2>14. Kontakt</h2>
            <p>
              <strong>{siteConfig.company.name}</strong><br />
              {siteConfig.contact.address.full}<br />
              IČO: {siteConfig.company.ico}<br />
              DIČ: {siteConfig.company.dic}<br />
              Email: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><br />
              Telefon: <a href={`tel:${siteConfig.contact.phoneRaw}`}>{siteConfig.contact.phone}</a><br />
              Web: <a href={siteConfig.url}>{siteConfig.url}</a>
            </p>

            <p className="text-sm text-gray-600 mt-12">
              Tyto obchodní podmínky jsou platné od 1. 1. 2024.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
