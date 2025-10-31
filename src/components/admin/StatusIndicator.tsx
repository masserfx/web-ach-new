'use client';

import { getStatusColor, getStatusTextColor } from './utils';

interface StatusIndicatorProps {
  status: 'running' | 'stopped' | 'error' | 'listening' | 'closed';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusIndicator({ status, size = 'md' }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusToDisplayStatus = {
    running: 'Running',
    stopped: 'Stopped',
    error: 'Error',
    listening: 'Listening',
    closed: 'Closed',
  };

  const dotColor = {
    running: 'bg-green-500',
    stopped: 'bg-red-500',
    error: 'bg-yellow-500',
    listening: 'bg-green-500',
    closed: 'bg-red-500',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} ${dotColor[status]} rounded-full animate-pulse`} />
      <span className={`text-sm font-medium ${getStatusTextColor(status)}`}>
        {statusToDisplayStatus[status]}
      </span>
    </div>
  );
}
