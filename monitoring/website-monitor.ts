#!/usr/bin/env node
/**
 * Website Monitoring System using Claude Agent SDK
 *
 * Features:
 * - Lighthouse performance monitoring
 * - Content change detection
 * - SEO validation
 * - Automated reporting
 * - Continuous integration support
 */

import { query, tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

// ============================================================================
// Configuration
// ============================================================================

interface MonitorConfig {
  baseUrl: string;
  pages: string[];
  checkInterval: number; // minutes
  lighthouseThresholds: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  notificationWebhook?: string;
  reportPath: string;
}

const DEFAULT_CONFIG: MonitorConfig = {
  baseUrl: 'http://91.99.126.53:3100',
  pages: [
    '/',
    '/produkty',
    '/produkty/convert-ng-one-l',
    '/blog',
    '/kontakt',
  ],
  checkInterval: 30, // Check every 30 minutes
  lighthouseThresholds: {
    performance: 95,
    accessibility: 95,
    bestPractices: 95,
    seo: 100,
  },
  reportPath: './monitoring/reports',
};

// ============================================================================
// MCP Tools for Website Monitoring
// ============================================================================

const lighthouseCheckTool = tool(
  'lighthouse_check',
  'Run Lighthouse audit on a specific URL and return performance metrics',
  {
    url: z.string().url().describe('The URL to audit'),
    categories: z
      .array(z.enum(['performance', 'accessibility', 'best-practices', 'seo']))
      .optional()
      .describe('Categories to audit'),
  },
  async (args) => {
    // Run Lighthouse using Chrome DevTools Protocol
    const { execSync } = await import('child_process');

    try {
      const categories = args.categories?.join(',') || 'performance,accessibility,best-practices,seo';
      const tmpFile = `/tmp/lighthouse-${Date.now()}.json`;

      // Run Lighthouse CLI
      execSync(
        `npx lighthouse "${args.url}" --output=json --output-path="${tmpFile}" --only-categories=${categories} --chrome-flags="--headless --no-sandbox"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      // Read results
      const results = JSON.parse(await fs.readFile(tmpFile, 'utf8'));
      await fs.unlink(tmpFile); // Cleanup

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              url: args.url,
              timestamp: new Date().toISOString(),
              scores: {
                performance: results.categories.performance?.score * 100 || 0,
                accessibility: results.categories.accessibility?.score * 100 || 0,
                bestPractices: results.categories['best-practices']?.score * 100 || 0,
                seo: results.categories.seo?.score * 100 || 0,
              },
              metrics: {
                firstContentfulPaint: results.audits['first-contentful-paint']?.numericValue,
                largestContentfulPaint: results.audits['largest-contentful-paint']?.numericValue,
                totalBlockingTime: results.audits['total-blocking-time']?.numericValue,
                cumulativeLayoutShift: results.audits['cumulative-layout-shift']?.numericValue,
                speedIndex: results.audits['speed-index']?.numericValue,
              },
            }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error running Lighthouse: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

const pageContentHashTool = tool(
  'page_content_hash',
  'Generate hash of page content to detect changes',
  {
    url: z.string().url().describe('The URL to hash'),
  },
  async (args) => {
    const { createHash } = await import('crypto');

    try {
      // Fetch page content
      const response = await fetch(args.url);
      const html = await response.text();

      // Remove dynamic content (timestamps, session IDs, etc.)
      const cleanHtml = html
        .replace(/timestamp="\d+"/g, '')
        .replace(/session-id="[^"]+"/g, '')
        .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '');

      // Generate hash
      const hash = createHash('sha256').update(cleanHtml).digest('hex');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              url: args.url,
              hash,
              timestamp: new Date().toISOString(),
              contentLength: html.length,
            }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching page: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

const saveReportTool = tool(
  'save_report',
  'Save monitoring report to filesystem',
  {
    reportData: z.string().describe('JSON report data'),
    filename: z.string().describe('Report filename'),
  },
  async (args) => {
    try {
      const reportPath = path.join(DEFAULT_CONFIG.reportPath, args.filename);
      await fs.mkdir(path.dirname(reportPath), { recursive: true });
      await fs.writeFile(reportPath, args.reportData, 'utf8');

      return {
        content: [
          {
            type: 'text',
            text: `Report saved to ${reportPath}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error saving report: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

const sendNotificationTool = tool(
  'send_notification',
  'Send notification via webhook when thresholds are breached',
  {
    message: z.string().describe('Notification message'),
    severity: z.enum(['info', 'warning', 'critical']).describe('Severity level'),
  },
  async (args) => {
    if (!DEFAULT_CONFIG.notificationWebhook) {
      return {
        content: [
          {
            type: 'text',
            text: 'No notification webhook configured',
          },
        ],
      };
    }

    try {
      await fetch(DEFAULT_CONFIG.notificationWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: args.message,
          severity: args.severity,
          timestamp: new Date().toISOString(),
          source: 'AC Heating Website Monitor',
        }),
      });

      return {
        content: [
          {
            type: 'text',
            text: 'Notification sent successfully',
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error sending notification: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ============================================================================
// MCP Server Setup
// ============================================================================

const monitoringServer = createSdkMcpServer({
  name: 'website-monitoring',
  version: '1.0.0',
  tools: [
    lighthouseCheckTool,
    pageContentHashTool,
    saveReportTool,
    sendNotificationTool,
  ],
});

// ============================================================================
// Monitoring Functions
// ============================================================================

async function runMonitoringCycle() {
  console.log('🚀 Starting website monitoring cycle...\n');

  const results = query({
    prompt: `
You are a website monitoring agent for AC Heating (${DEFAULT_CONFIG.baseUrl}).

Your task is to:
1. Check Lighthouse performance for all configured pages: ${DEFAULT_CONFIG.pages.join(', ')}
2. Compare scores against thresholds: ${JSON.stringify(DEFAULT_CONFIG.lighthouseThresholds)}
3. Detect content changes by comparing page hashes with previous run
4. Generate a comprehensive monitoring report
5. Send notifications if any thresholds are breached

For each page:
- Run lighthouse_check tool
- Run page_content_hash tool
- Compare results with previous data (if available)
- Identify any regressions or improvements

After analyzing all pages:
- Create a summary report with:
  * Overall health status (GREEN/YELLOW/RED)
  * Per-page Lighthouse scores
  * Any detected content changes
  * Recommendations for improvements
  * Trend analysis (if historical data available)
- Save the report using save_report tool with filename format: report-YYYY-MM-DD-HH-mm.json
- If any score is below threshold, send notification using send_notification tool

Previous monitoring data (if available): ${await loadPreviousReport()}

Be thorough and actionable in your analysis.
    `.trim(),
    options: {
      model: 'sonnet',
      mcpServers: {
        monitoring: monitoringServer,
      },
      allowedTools: [
        'lighthouse_check',
        'page_content_hash',
        'save_report',
        'send_notification',
      ],
      permissionMode: 'bypassPermissions',
      systemPrompt: {
        type: 'preset',
        preset: 'claude_code',
        append: `
You are an expert website performance analyst specializing in Next.js applications.
You understand Lighthouse metrics, SEO best practices, and modern web performance standards.
Your reports should be actionable and prioritize high-impact improvements.
        `.trim(),
      },
    },
  });

  let finalResult = '';

  for await (const message of results) {
    if (message.type === 'assistant') {
      // Stream assistant messages
      console.log('🤖 Agent:', message.message);
    } else if (message.type === 'result') {
      if (message.subtype === 'success') {
        finalResult = message.result;
        console.log('\n✅ Monitoring cycle completed successfully');
        console.log(`📊 Total cost: $${message.total_cost_usd.toFixed(4)}`);
        console.log(`⏱️  Duration: ${(message.duration_ms / 1000).toFixed(2)}s\n`);
      } else {
        console.error('\n❌ Monitoring cycle failed:', message);
      }
    }
  }

  return finalResult;
}

async function loadPreviousReport(): Promise<string> {
  try {
    const files = await fs.readdir(DEFAULT_CONFIG.reportPath);
    const reportFiles = files.filter(f => f.startsWith('report-') && f.endsWith('.json'));

    if (reportFiles.length === 0) {
      return 'No previous monitoring data available';
    }

    // Get most recent report
    reportFiles.sort().reverse();
    const latestReport = await fs.readFile(
      path.join(DEFAULT_CONFIG.reportPath, reportFiles[0]),
      'utf8'
    );

    return latestReport;
  } catch (error) {
    return 'No previous monitoring data available';
  }
}

async function startContinuousMonitoring() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         AC Heating Website Monitoring System                  ║
║                                                               ║
║  Base URL: ${DEFAULT_CONFIG.baseUrl.padEnd(50)}║
║  Check Interval: ${String(DEFAULT_CONFIG.checkInterval).padEnd(47)} minutes║
║  Pages Monitored: ${String(DEFAULT_CONFIG.pages.length).padEnd(46)}║
╚═══════════════════════════════════════════════════════════════╝
  `);

  // Run immediately
  await runMonitoringCycle();

  // Schedule periodic checks
  setInterval(async () => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`⏰ Scheduled check at ${new Date().toISOString()}`);
    console.log('='.repeat(70));
    await runMonitoringCycle();
  }, DEFAULT_CONFIG.checkInterval * 60 * 1000);
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'monitor';

  switch (command) {
    case 'monitor':
      await startContinuousMonitoring();
      break;

    case 'once':
      await runMonitoringCycle();
      process.exit(0);
      break;

    case 'report':
      // Generate on-demand report
      const report = await loadPreviousReport();
      console.log('\n📊 Latest Monitoring Report:\n');
      console.log(JSON.parse(report));
      process.exit(0);
      break;

    default:
      console.log(`
Usage: website-monitor.ts [command]

Commands:
  monitor    Start continuous monitoring (default)
  once       Run monitoring cycle once and exit
  report     Display latest monitoring report

Environment Variables:
  MONITORING_WEBHOOK    Webhook URL for notifications
  MONITORING_INTERVAL   Check interval in minutes (default: 30)
      `);
      process.exit(1);
  }
}

// ============================================================================
// Entry Point
// ============================================================================

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export {
  runMonitoringCycle,
  startContinuousMonitoring,
  monitoringServer,
  DEFAULT_CONFIG,
};
