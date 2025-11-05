import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Home, 
  DollarSign, Clock, FileText, CheckCircle, User, Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Detail leadu | Admin | AC Heating',
  robots: { index: false, follow: false },
};

async function getLead(id: string) {
  const supabase = await createClient();
  
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !lead) {
    return null;
  }
  
  return lead;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  contacted: 'bg-purple-100 text-purple-800 border-purple-200',
  qualified: 'bg-green-100 text-green-800 border-green-200',
  proposal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  negotiation: 'bg-orange-100 text-orange-800 border-orange-200',
  won: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  lost: 'bg-red-100 text-red-800 border-red-200',
  archived: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

const statusLabels: Record<string, string> = {
  new: 'Nový',
  contacted: 'Kontaktován',
  qualified: 'Kvalifikován',
  proposal: 'Nabídka',
  negotiation: 'Jednání',
  won: 'Vyhrán',
  lost: 'Ztracen',
  archived: 'Archivován',
};

const urgencyLabels: Record<string, string> = {
  immediate: 'Co nejdříve',
  this_month: 'Tento měsíc',
  this_quarter: 'Toto čtvrtletí',
  planning: 'Plánování',
};

const propertyTypeLabels: Record<string, string> = {
  rodinny_dum: 'Rodinný dům',
  bytovy_dum: 'Bytový dům',
  firma: 'Firma',
  developer: 'Developer',
};

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id);
  
  if (!lead) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/leads"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900">
                  {lead.first_name} {lead.last_name}
                </h1>
                <p className="text-zinc-600 text-sm mt-1">
                  Lead ID: {lead.id.substring(0, 8)}...
                </p>
              </div>
            </div>
            <div>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${
                  statusColors[lead.status] || statusColors.new
                }`}
              >
                {statusLabels[lead.status] || lead.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                Kontaktní údaje
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-zinc-900 hover:text-red-600">
                      {lead.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold">Telefon</p>
                    <a href={`tel:${lead.phone}`} className="text-zinc-900 hover:text-red-600">
                      {lead.phone}
                    </a>
                  </div>
                </div>
                {lead.city && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-semibold">Město</p>
                      <p className="text-zinc-900">{lead.city}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            {(lead.property_type || lead.property_size_sqm || lead.budget_range) && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-red-600" />
                  Informace o objektu
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {lead.property_type && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Typ objektu</p>
                      <p className="text-zinc-900 font-medium">
                        {propertyTypeLabels[lead.property_type] || lead.property_type}
                      </p>
                    </div>
                  )}
                  {lead.property_size_sqm && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Plocha</p>
                      <p className="text-zinc-900 font-medium">{lead.property_size_sqm} m²</p>
                    </div>
                  )}
                  {lead.budget_range && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Rozpočet</p>
                      <p className="text-zinc-900 font-medium">{lead.budget_range}</p>
                    </div>
                  )}
                  {lead.urgency && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Časový rámec</p>
                      <p className="text-zinc-900 font-medium">
                        {urgencyLabels[lead.urgency] || lead.urgency}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project Description */}
            {lead.project_description && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Popis projektu
                </h2>
                <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
                  {lead.project_description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Meta Info */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
              <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                Timeline
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Vytvořen</p>
                  <p className="text-zinc-900">
                    {new Date(lead.created_at).toLocaleDateString('cs-CZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {lead.updated_at && lead.updated_at !== lead.created_at && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Aktualizován</p>
                    <p className="text-zinc-900">
                      {new Date(lead.updated_at).toLocaleDateString('cs-CZ', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Source & Type */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Zdroj & Typ</h2>
              <div className="space-y-3">
                {lead.source && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Zdroj</p>
                    <p className="text-zinc-900 capitalize">{lead.source}</p>
                  </div>
                )}
                {lead.lead_type && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Typ leadu</p>
                    <p className="text-zinc-900">{lead.lead_type.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* GDPR Consent */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
              <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                GDPR
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle 
                    className={`w-5 h-5 ${lead.gdpr_consent ? 'text-green-600' : 'text-zinc-300'}`} 
                  />
                  <span className="text-sm text-zinc-700">GDPR souhlas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle 
                    className={`w-5 h-5 ${lead.marketing_consent ? 'text-green-600' : 'text-zinc-300'}`} 
                  />
                  <span className="text-sm text-zinc-700">Marketing souhlas</span>
                </div>
                {lead.consent_timestamp && (
                  <div className="pt-2 border-t border-zinc-200">
                    <p className="text-xs text-zinc-500">
                      Souhlas udělen: {new Date(lead.consent_timestamp).toLocaleDateString('cs-CZ')}
                    </p>
                    {lead.consent_ip && (
                      <p className="text-xs text-zinc-500">IP: {lead.consent_ip}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-sm p-6 border border-red-200">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Akce</h2>
              <div className="space-y-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="block w-full px-4 py-3 bg-red-600 text-white rounded-lg text-center font-semibold hover:bg-red-700 transition-colors"
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Poslat email
                </a>
                <a
                  href={`tel:${lead.phone}`}
                  className="block w-full px-4 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg text-center font-semibold hover:bg-red-50 transition-colors"
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Zavolat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
