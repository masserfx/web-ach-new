import { createClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  try {
    // Local development bypass (localhost Supabase)
    const isLocalSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost');

    if (process.env.NODE_ENV === 'development' || isLocalSupabase || process.env.ADMIN_BYPASS_AUTH === 'true') {
      console.log('[requireAdmin] Local development - bypassing auth check');
      return {
        id: 'local-admin-user',
        email: 'admin@ac-heating.cz',
        user_metadata: { role: 'admin' },
      };
    }

    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error('Unauthorized: Not authenticated');
    }

    // For now, check if user has admin email or role
    // In production, fetch from profiles table
    const isAdmin = user.email?.endsWith('@ac-heating.cz') ||
                    user.user_metadata?.role === 'admin';

    if (!isAdmin) {
      throw new Error('Forbidden: Admin access required');
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Authentication failed');
  }
}

export async function optionalAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const isAdmin = user.email?.endsWith('@ac-heating.cz') ||
                    user.user_metadata?.role === 'admin';

    return isAdmin ? user : null;
  } catch {
    return null;
  }
}
