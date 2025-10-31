'use client';

import { StatCard } from './StatCard';
import { formatUptime, getCpuColor, getMemoryColor } from './utils';

interface ServerStatsProps {
  stats: {
    system: {
      platform: string;
      arch: string;
      nodeVersion: string;
      npmVersion: string;
      uptime: string;
      cpuModel: string;
      cpuCores: number;
    };
    cpu: {
      model: string;
      cores: number;
      usage: number;
    };
    memory: {
      total: number;
      used: number;
      free: number;
      percentage: number;
    };
  };
}

export function ServerStats({ stats }: ServerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="CPU Usage"
        value={`${stats.cpu.usage.toFixed(1)}%`}
        subtitle={`${stats.cpu.cores} cores`}
        color={
          stats.cpu.usage > 80
            ? 'red'
            : stats.cpu.usage > 50
              ? 'orange'
              : 'green'
        }
      />

      <StatCard
        title="Memory Usage"
        value={`${stats.memory.percentage.toFixed(1)}%`}
        subtitle={`${stats.memory.used}/${stats.memory.total} MB`}
        color={
          stats.memory.percentage > 80
            ? 'red'
            : stats.memory.percentage > 50
              ? 'orange'
              : 'green'
        }
      />

      <StatCard
        title="System Uptime"
        value={formatUptime(stats.system.uptime)}
        subtitle={stats.system.platform}
        color="blue"
      />

      <StatCard
        title="Stack Version"
        value={`Node ${stats.system.nodeVersion.replace('v', '')}`}
        subtitle={`npm ${stats.system.npmVersion.replace('v', '')}`}
        color="gray"
      />
    </div>
  );
}
