// Helper functions for admin components

export function formatUptime(seconds: number | string): string {
  const s = typeof seconds === 'string' ? parseInt(seconds) : seconds;

  if (isNaN(s) || s < 0) return 'Unknown';

  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatPercentage(value: number): string {
  return Math.round(value * 100) / 100 + '%';
}

export function getStatusColor(
  status: 'running' | 'stopped' | 'error' | 'listening' | 'closed',
  isDark: boolean = true
): string {
  switch (status) {
    case 'running':
    case 'listening':
      return isDark ? 'bg-green-500/20 border-green-500' : 'bg-green-100 border-green-500';
    case 'stopped':
    case 'closed':
      return isDark ? 'bg-red-500/20 border-red-500' : 'bg-red-100 border-red-500';
    case 'error':
      return isDark ? 'bg-yellow-500/20 border-yellow-500' : 'bg-yellow-100 border-yellow-500';
    default:
      return isDark ? 'bg-gray-500/20 border-gray-500' : 'bg-gray-100 border-gray-500';
  }
}

export function getStatusTextColor(
  status: 'running' | 'stopped' | 'error' | 'listening' | 'closed'
): string {
  switch (status) {
    case 'running':
    case 'listening':
      return 'text-green-500';
    case 'stopped':
    case 'closed':
      return 'text-red-500';
    case 'error':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
}

export function getCpuColor(usage: number): string {
  if (usage < 25) return 'text-green-500';
  if (usage < 50) return 'text-yellow-500';
  if (usage < 75) return 'text-orange-500';
  return 'text-red-500';
}

export function getMemoryColor(percentage: number): string {
  if (percentage < 25) return 'text-green-500';
  if (percentage < 50) return 'text-yellow-500';
  if (percentage < 75) return 'text-orange-500';
  return 'text-red-500';
}
