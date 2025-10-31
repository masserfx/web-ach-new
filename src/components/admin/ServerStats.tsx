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
    disk: {
      filesystem: string;
      total: string;
      used: string;
      available: string;
      percentage: number;
      mountpoint: string;
    };
    load: {
      '1min': number;
      '5min': number;
      '15min': number;
    };
  };
}

export function ServerStats({ stats }: ServerStatsProps) {
  // Determine disk color based on percentage
  const getDiskColor = (percentage: number): 'green' | 'orange' | 'red' => {
    if (percentage < 70) return 'green';
    if (percentage < 90) return 'orange';
    return 'red';
  };

  // Determine load average color based on CPU cores
  const getLoadColor = (load: number, cores: number): 'green' | 'orange' | 'red' => {
    if (load < cores) return 'green';
    if (load < cores * 2) return 'orange';
    return 'red';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        title="Disk Usage"
        value={`${stats.disk.percentage}%`}
        subtitle={`${stats.disk.used} / ${stats.disk.total}`}
        color={getDiskColor(stats.disk.percentage)}
      />

      <StatCard
        title="Load Average (1m)"
        value={stats.load['1min'].toFixed(2)}
        subtitle={`5m: ${stats.load['5min'].toFixed(2)} | 15m: ${stats.load['15min'].toFixed(2)}`}
        color={getLoadColor(stats.load['1min'], stats.cpu.cores)}
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
