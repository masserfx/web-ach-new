export interface TaskDetailResponse {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  progress: number;
  quality_score: number | null;
  assigned_agent: string | null;
  dependencies: string[];
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  execution_logs?: any[];
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  progress?: number;
  quality_score?: number | null;
  assigned_agent?: string | null;
}
