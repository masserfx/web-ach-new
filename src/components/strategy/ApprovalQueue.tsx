'use client';

import { useState, useEffect } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';

interface Approval {
  id: string;
  task_id: string;
  task?: {
    title: string;
    category: string;
    agent_name: string;
  };
  version: number;
  review_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  submitted_by: string;
  submitted_at: string;
  reviewer_email: string | null;
  reviewed_at: string | null;
  decision: 'approve' | 'reject' | 'request_revision' | null;
  reviewer_notes: string | null;
}

interface ApprovalQueueProps {
  onRefresh?: () => void;
}

export function ApprovalQueue({ onRefresh }: ApprovalQueueProps) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approverEmail, setApproverEmail] = useState('');
  const [approverNotes, setApproverNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadApprovals();
  }, [filter]);

  async function loadApprovals() {
    try {
      const url = filter === 'all'
        ? '/api/strategy/approvals'
        : `/api/strategy/approvals?status=${filter}`;

      const response = await fetch(url);
      const data: Approval[] = await response.json();
      setApprovals(data);
    } catch (error) {
      console.error('Error loading approvals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApproval(
    approvalId: string,
    decision: 'approve' | 'reject' | 'request_revision'
  ) {
    if (!approverEmail.trim()) {
      alert('Prosím, zadejte svůj email');
      return;
    }

    setProcessingId(approvalId);
    try {
      const statusMap = {
        approve: 'approved' as const,
        reject: 'rejected' as const,
        request_revision: 'needs_revision' as const,
      };

      // TODO: Create PATCH endpoint for approvals
      // For now, just update local state
      const response = await fetch(`/api/strategy/approvals/${approvalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_status: statusMap[decision],
          decision,
          reviewer_email: approverEmail,
          reviewer_notes: approverNotes || null,
          reviewed_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update approval');
      }

      // Aktualizuj lokální stav
      setApprovals(
        approvals.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                review_status: statusMap[decision],
                decision,
                reviewer_email: approverEmail,
                reviewer_notes: approverNotes || null,
                reviewed_at: new Date().toISOString(),
              }
            : a
        )
      );

      setExpandedId(null);
      setApproverNotes('');
      onRefresh?.();
    } catch (error) {
      console.error('Error updating approval:', error);
      alert('Chyba při aktualizaci schválení');
    } finally {
      setProcessingId(null);
    }
  }

  const filteredApprovals = approvals.filter((a) => {
    if (filter === 'all') return true;
    return a.review_status === filter;
  });

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    needs_revision: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-steel-dim">Načítám schválení...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Fronta schválení</h2>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-graphite text-steel-dim hover:text-steel'
              }`}
            >
              {f === 'all' && 'Všechna'}
              {f === 'pending' && 'Čekající'}
              {f === 'approved' && 'Schválena'}
              {f === 'rejected' && 'Zamítnutá'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <div
            key={approval.id}
            className="bg-graphite rounded-lg border border-graphite-light/30 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedId(expandedId === approval.id ? null : approval.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-graphite-light/20 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1 text-left">
                <div className={`px-3 py-1 rounded text-sm font-semibold border ${statusColors[approval.review_status]}`}>
                  {approval.review_status === 'pending' && '⏳ Čekající'}
                  {approval.review_status === 'approved' && '✓ Schváleno'}
                  {approval.review_status === 'rejected' && '✕ Zamítnuté'}
                  {approval.review_status === 'needs_revision' && '⟳ Revize'}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Schválení verze {approval.version}
                  </h3>
                  <p className="text-sm text-steel-dim mt-1">
                    Odesláno: {approval.submitted_by} •{' '}
                    {new Date(approval.submitted_at).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
              </div>

              <div className="text-steel-dim">
                {expandedId === approval.id ? '↑' : '↓'}
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === approval.id && (
              <div className="px-6 py-4 border-t border-graphite-light/30 bg-graphite-light/10 space-y-4">
                {/* Content Preview */}
                {approval.review_status === 'pending' && (
                  <>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Náhled obsahu</h4>
                      <div className="bg-carbon rounded p-4 text-sm text-steel-dim max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(approval, null, 2).substring(0, 500)}...
                        </pre>
                      </div>
                    </div>

                    {/* Reviewer Info */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-steel-dim mb-1">
                          Váš email
                        </label>
                        <input
                          type="email"
                          value={approverEmail}
                          onChange={(e) => setApproverEmail(e.target.value)}
                          placeholder="reviewer@example.com"
                          className="w-full bg-carbon border border-graphite-light/30 rounded px-3 py-2 text-white placeholder-steel-dim focus:border-accent focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-steel-dim mb-1">
                          Vaše poznámky (volitelné)
                        </label>
                        <textarea
                          value={approverNotes}
                          onChange={(e) => setApproverNotes(e.target.value)}
                          placeholder="Např: Musíte aktualizovat SEO meta tags..."
                          rows={3}
                          className="w-full bg-carbon border border-graphite-light/30 rounded px-3 py-2 text-white placeholder-steel-dim focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-graphite-light/30">
                      <button
                        onClick={() => handleApproval(approval.id, 'approve')}
                        disabled={processingId === approval.id || !approverEmail.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Check size={18} />
                        Schválit
                      </button>
                      <button
                        onClick={() => handleApproval(approval.id, 'request_revision')}
                        disabled={processingId === approval.id || !approverEmail.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-colors"
                      >
                        <MessageSquare size={18} />
                        Revize
                      </button>
                      <button
                        onClick={() => handleApproval(approval.id, 'reject')}
                        disabled={processingId === approval.id || !approverEmail.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed transition-colors"
                      >
                        <X size={18} />
                        Zamítnout
                      </button>
                    </div>
                  </>
                )}

                {approval.review_status !== 'pending' && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-steel-dim">Rozhodnutí:</span>{' '}
                      <span className="text-white font-semibold">
                        {approval.decision === 'approve' && 'Schváleno'}
                        {approval.decision === 'reject' && 'Zamítnuté'}
                        {approval.decision === 'request_revision' && 'Požaduje revizi'}
                      </span>
                    </p>
                    {approval.reviewer_email && (
                      <p className="text-sm">
                        <span className="text-steel-dim">Recenzent:</span>{' '}
                        <span className="text-white">{approval.reviewer_email}</span>
                      </p>
                    )}
                    {approval.reviewed_at && (
                      <p className="text-sm">
                        <span className="text-steel-dim">Zhodnoceno:</span>{' '}
                        <span className="text-white">
                          {new Date(approval.reviewed_at).toLocaleDateString('cs-CZ')}
                        </span>
                      </p>
                    )}
                    {approval.reviewer_notes && (
                      <div className="mt-3 p-3 bg-carbon rounded text-sm text-steel">
                        <p className="text-steel-dim font-semibold mb-1">Poznámky:</p>
                        {approval.reviewer_notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredApprovals.length === 0 && (
          <div className="text-center py-12 text-steel-dim">
            <p>Žádné schválení pro zobrazení</p>
          </div>
        )}
      </div>
    </div>
  );
}
