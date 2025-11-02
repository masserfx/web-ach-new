import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, TrendingUp, Users, CheckCircle2, Clock, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin - Správa leadů | AC Heating',
  robots: { index: false, follow: false },
};

async function getLeads() {
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return leads || [];
}

async function getLeadStats() {
  const supabase = await createClient();

  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  const { count: qualifiedLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'qualified');

  const { count: wonLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'won');

  return {
    total: totalLeads || 0,
    new: newLeads || 0,
    qualified: qualifiedLeads || 0,
    won: wonLeads || 0,
  };
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

export default async function AdminLeadsPage() {
  const leads = await getLeads();
  const stats = await getLeadStats();

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-zinc-900">Správa leadů</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-600">
                Celkem: <span className="font-bold text-zinc-900">{stats.total}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-600 text-sm font-medium">Celkem</span>
              <Users className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Nové</span>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-900">{stats.new}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Kvalifikované</span>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-900">{stats.qualified}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-600 text-sm font-medium">Vyhráno</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-900">{stats.won}</div>
          </div>
        </div>

        {/* Leads List */}
        {leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              Zatím žádné leady
            </h3>
            <p className="text-zinc-600">
              Nové leady se zobrazí zde, jakmile někdo vyplní formulář.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead: any) => (
              <div
                key={lead.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-12 gap-6">
                  {/* Left: Contact Info */}
                  <div className="md:col-span-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-lg">
                          {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-zinc-600 mt-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(lead.created_at).toLocaleDateString('cs-CZ')}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-700">
                        <Mail className="w-4 h-4 text-zinc-400" />
                        <a href={`mailto:${lead.email}`} className="hover:text-red-600">
                          {lead.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-700">
                        <Phone className="w-4 h-4 text-zinc-400" />
                        <a href={`tel:${lead.phone}`} className="hover:text-red-600">
                          {lead.phone}
                        </a>
                      </div>
                      {lead.city && (
                        <div className="flex items-center gap-2 text-sm text-zinc-700">
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          {lead.city}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Property Info */}
                  <div className="md:col-span-5">
                    <div className="space-y-3">
                      {lead.property_type && (
                        <div>
                          <span className="text-xs font-semibold text-zinc-500 uppercase">
                            Objekt
                          </span>
                          <p className="text-zinc-900 font-medium">
                            {lead.property_type.replace('_', ' ')}
                            {lead.property_size_sqm && ` (${lead.property_size_sqm} m²)`}
                          </p>
                        </div>
                      )}

                      {lead.budget_range && (
                        <div>
                          <span className="text-xs font-semibold text-zinc-500 uppercase">
                            Rozpočet
                          </span>
                          <p className="text-zinc-900">{lead.budget_range}</p>
                        </div>
                      )}

                      {lead.urgency && (
                        <div>
                          <span className="text-xs font-semibold text-zinc-500 uppercase">
                            Časový rámec
                          </span>
                          <p className="text-zinc-900">
                            {urgencyLabels[lead.urgency] || lead.urgency}
                          </p>
                        </div>
                      )}

                      {lead.project_description && (
                        <div>
                          <span className="text-xs font-semibold text-zinc-500 uppercase">
                            Popis
                          </span>
                          <p className="text-zinc-700 text-sm line-clamp-2">
                            {lead.project_description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="md:col-span-3">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                          Status
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                            statusColors[lead.status] || statusColors.new
                          }`}
                        >
                          {statusLabels[lead.status] || lead.status}
                        </span>
                      </div>

                      {lead.lead_type && (
                        <div>
                          <span className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                            Typ
                          </span>
                          <span className="text-zinc-700 text-sm">
                            {lead.lead_type.replace('_', ' ')}
                          </span>
                        </div>
                      )}

                      <div className="pt-2">
                        <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                          Zobrazit detail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
