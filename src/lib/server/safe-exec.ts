import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Whitelist allowed commands with parameters
const ALLOWED_COMMANDS = {
  'cpu-usage': () => 'top -bn1 | grep "Cpu(s)"',
  'memory-info': () => 'free -m',
  'node-version': () => 'node --version',
  'npm-version': () => 'npm --version',
  'system-uptime': () => 'uptime -p',
  'platform-info': () => 'uname -s -m',
  'cpu-cores': () => 'nproc',
  'cpu-model': () => "lscpu | grep 'Model name' | head -1",
  'docker-ps': () => 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"',
  'list-node-processes': () => "ps aux | grep -E '[n]ode|[n]pm' | awk '{print $2, $11, $12, $13}'",
  'port-check': (port: number) => {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('Invalid port number');
    }
    return `ss -tlnp | grep :${port} || true`;
  },
  'port-info': (port: number) => {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('Invalid port number');
    }
    return `ss -tlnp | grep :${port} || true`;
  },
  'kill-process': (pid: number) => {
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new Error('Invalid process ID');
    }
    return `kill -SIGTERM ${pid}`;
  },
  'force-kill-process': (pid: number) => {
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new Error('Invalid process ID');
    }
    return `kill -SIGKILL ${pid}`;
  },
  'kill-port': (port: number) => {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('Invalid port number');
    }
    // Extract PID from ss output and kill it
    return `ss -tlnp | grep :${port} | grep -oP 'pid=\\K[0-9]+' | xargs -r kill -9 2>/dev/null || true`;
  },
  'docker-logs': (containerName: string) => {
    if (!containerName.match(/^[a-zA-Z0-9_-]+$/)) {
      throw new Error('Invalid container name');
    }
    return `docker logs ${containerName} --tail 100`;
  },
  'get-db-version': () => 'psql -h localhost -p 54322 -U postgres -c "SELECT version();"',
  'get-active-connections': () =>
    'psql -h localhost -p 54322 -U postgres -c "SELECT count(*) FROM pg_stat_activity WHERE state = \'active\';"',
  'get-db-size': () =>
    'psql -h localhost -p 54322 -U postgres -c "SELECT pg_size_pretty(pg_database_size(\'postgres\'));"',
  'disk-usage': () => 'df -h / | tail -1',
  'disk-usage-all': () => 'df -h',
  'network-connections': () => 'ss -tuln | grep LISTEN | wc -l',
  'load-average': () => 'uptime | grep -o "load average.*" | cut -d: -f2',
} as const;

type CommandKey = keyof typeof ALLOWED_COMMANDS;

export async function safeExec(
  command: CommandKey,
  ...args: any[]
): Promise<string> {
  try {
    const commandFn = ALLOWED_COMMANDS[command];
    if (!commandFn) {
      throw new Error(`Unknown command: ${command}`);
    }

    const cmd = typeof commandFn === 'function'
      ? (commandFn as any)(...args)
      : commandFn;

    const { stdout, stderr } = await execAsync(cmd, {
      timeout: 10000, // 10 seconds timeout
      maxBuffer: 1024 * 1024, // 1MB max output
    });

    if (stderr && command !== 'docker-logs') {
      console.error(`[${command}] stderr:`, stderr);
    }

    return stdout.trim();
  } catch (error: any) {
    console.error(`[safeExec] Error executing ${command}:`, error.message);
    throw new Error(`Failed to execute command: ${command}. ${error.message}`);
  }
}

// Helper functions for common operations
export async function getSystemInfo() {
  const [platform, nodeVersion, npmVersion, uptime, cpuCores, cpuModel] = await Promise.all([
    safeExec('platform-info'),
    safeExec('node-version'),
    safeExec('npm-version'),
    safeExec('system-uptime'),
    safeExec('cpu-cores'),
    safeExec('cpu-model'),
  ]);

  return {
    platform: platform.split(' ')[0] === 'Linux' ? 'Linux' : 'Unknown',
    arch: platform.split(' ')[1] || 'x64',
    nodeVersion: nodeVersion.trim(),
    npmVersion: npmVersion.trim(),
    uptime: uptime.trim(),
    cpuCores: parseInt(cpuCores.trim()),
    cpuModel: cpuModel.split(':')[1]?.trim() || 'Unknown',
  };
}

export async function getCpuUsage() {
  const output = await safeExec('cpu-usage');
  const match = output.match(/Cpu\(s\):\s+([0-9.]+)%us/);
  return parseFloat(match?.[1] || '0');
}

export async function getMemoryInfo() {
  const output = await safeExec('memory-info');
  const lines = output.split('\n');
  const memLine = lines[1]; // "Mem:" line

  if (!memLine) {
    return { total: 0, used: 0, free: 0, percentage: 0 };
  }

  const parts = memLine.split(/\s+/);
  const total = parseInt(parts[1]);
  const used = parseInt(parts[2]);
  const free = parseInt(parts[3]);
  const percentage = (used / total) * 100;

  return { total, used, free, percentage };
}

export async function getPortInfo(port: number) {
  try {
    const output = await safeExec('port-info', port);
    if (!output || output.trim() === '') {
      return { port, status: 'closed', service: 'Unknown', pid: null };
    }

    // Parse ss output
    // Format: LISTEN 0 511 *:3100 *:* users:(("next-server (v1",pid=3802599,fd=22))
    const pidMatch = output.match(/pid=(\d+)/);
    const processMatch = output.match(/users:\(\("([^"]+)"/);

    const pid = pidMatch ? parseInt(pidMatch[1]) : null;
    const processName = processMatch ? processMatch[1] : 'Unknown';

    // Map service names
    const serviceMap: Record<string, string> = {
      'next-server': 'Next.js Dev',
      'node': 'Next.js Dev',
      'docker-proxy': 'Docker/Supabase',
      'docker': 'Docker/Supabase',
      'postgres': 'PostgreSQL',
    };

    // Find matching service name
    let service = 'Unknown';
    for (const [key, value] of Object.entries(serviceMap)) {
      if (processName.toLowerCase().includes(key)) {
        service = value;
        break;
      }
    }

    // If still unknown, use the process name
    if (service === 'Unknown' && processName !== 'Unknown') {
      service = processName;
    }

    return {
      port,
      status: 'listening' as const,
      service,
      pid,
    };
  } catch (error) {
    return { port, status: 'closed' as const, service: 'Unknown', pid: null };
  }
}

export async function getRunningProcesses(filter?: string) {
  try {
    const output = await safeExec('list-node-processes');
    if (!output) {
      return [];
    }

    const processes = output
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const parts = line.split(/\s+/);
        const pid = parseInt(parts[0]);
        const command = parts.slice(1).join(' ');

        return {
          pid,
          name: command.split('/').pop() || command,
          command,
        };
      });

    return filter
      ? processes.filter((p) => p.command.includes(filter))
      : processes;
  } catch {
    return [];
  }
}

export async function getDiskUsage() {
  try {
    const output = await safeExec('disk-usage');
    const parts = output.split(/\s+/);

    // df output: Filesystem Size Used Avail Use% Mounted
    return {
      filesystem: parts[0],
      total: parts[1],
      used: parts[2],
      available: parts[3],
      percentage: parseInt(parts[4]?.replace('%', '') || '0'),
      mountpoint: parts[5],
    };
  } catch {
    return {
      filesystem: 'Unknown',
      total: '0G',
      used: '0G',
      available: '0G',
      percentage: 0,
      mountpoint: '/',
    };
  }
}

export async function getLoadAverage() {
  try {
    const output = await safeExec('load-average');
    const loads = output.trim().split(',').map(s => parseFloat(s.trim()));

    return {
      '1min': loads[0] || 0,
      '5min': loads[1] || 0,
      '15min': loads[2] || 0,
    };
  } catch {
    return {
      '1min': 0,
      '5min': 0,
      '15min': 0,
    };
  }
}

export async function getNetworkConnections() {
  try {
    const output = await safeExec('network-connections');
    return parseInt(output.trim()) || 0;
  } catch {
    return 0;
  }
}
