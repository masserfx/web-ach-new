module.exports = {
  apps: [
    {
      name: 'ac-heating-vision-dev',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/leos/ac-heating-web-new',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3101,
        TURBOPACK: '1',
      },
      error_file: '/home/leos/ac-heating-web-new/logs/pm2-vision-error.log',
      out_file: '/home/leos/ac-heating-web-new/logs/pm2-vision-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
