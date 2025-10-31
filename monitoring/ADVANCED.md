# Advanced Use Cases - Website Monitoring System

## Pokročilé konfigurace a use cases pro Claude Agent SDK monitoring systém

## Table of Contents

- [Custom MCP Tools](#custom-mcp-tools)
- [Advanced Prompting](#advanced-prompting)
- [Multi-Environment Monitoring](#multi-environment-monitoring)
- [Performance Budget Integration](#performance-budget-integration)
- [Visual Regression Testing](#visual-regression-testing)
- [A/B Testing Analysis](#ab-testing-analysis)
- [Cost Optimization](#cost-optimization)

---

## Custom MCP Tools

### Screenshot Comparison Tool

```typescript
import Jimp from 'jimp';
import pixelmatch from 'pixelmatch';

const screenshotCompareTool = tool(
  'screenshot_compare',
  'Compare current screenshot with baseline for visual regression testing',
  {
    url: z.string().url(),
    baselineImage: z.string().describe('Path to baseline screenshot'),
  },
  async (args) => {
    const { chromium } = await import('playwright');

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(args.url);

    // Take screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    // Load baseline
    const baseline = await Jimp.read(args.baselineImage);
    const current = await Jimp.read(screenshot);

    // Compare
    const { width, height } = baseline.bitmap;
    const diff = new Jimp(width, height);

    const numDiffPixels = pixelmatch(
      baseline.bitmap.data,
      current.bitmap.data,
      diff.bitmap.data,
      width,
      height,
      { threshold: 0.1 }
    );

    const diffPercentage = (numDiffPixels / (width * height)) * 100;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            url: args.url,
            diffPixels: numDiffPixels,
            diffPercentage: diffPercentage.toFixed(2),
            threshold: 5, // 5% difference threshold
            passed: diffPercentage < 5,
          }),
        },
      ],
    };
  }
);
```

### Custom Performance Metrics Tool

```typescript
const customMetricsTool = tool(
  'custom_performance_metrics',
  'Collect custom performance metrics using Performance API',
  {
    url: z.string().url(),
    metrics: z.array(z.string()).describe('Metrics to collect'),
  },
  async (args) => {
    const { chromium } = await import('playwright');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Collect metrics
    await page.goto(args.url, { waitUntil: 'networkidle' });

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      return {
        // Navigation Timing
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domInteractive: navigation.domInteractive,
        domComplete: navigation.domComplete,
        loadComplete: navigation.loadEventEnd,

        // Paint Timing
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime,

        // Resource Timing
        totalResources: performance.getEntriesByType('resource').length,
        totalTransferSize: performance
          .getEntriesByType('resource')
          .reduce((acc: number, r: any) => acc + (r.transferSize || 0), 0),
      };
    });

    await browser.close();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(metrics, null, 2),
        },
      ],
    };
  }
);
```

---

## Advanced Prompting

### Multi-Stage Analysis Prompt

```typescript
const advancedPrompt = `
You are an expert website performance engineer analyzing AC Heating's website.

# Stage 1: Data Collection
Collect comprehensive performance data for these pages:
${config.pages.map(p => `- ${p}`).join('\n')}

For each page, gather:
1. Lighthouse metrics (all categories)
2. Core Web Vitals (LCP, FID, CLS)
3. Custom performance metrics
4. Content hash for change detection

# Stage 2: Trend Analysis
Compare current data with historical data from previous 7 days:
- Identify performance trends (improving/degrading)
- Detect anomalies (sudden spikes/drops)
- Calculate week-over-week change percentages

# Stage 3: Root Cause Analysis
For any degraded metrics:
1. Analyze resource waterfall
2. Identify blocking resources
3. Check for new/changed assets
4. Review third-party scripts

# Stage 4: Recommendations
Provide actionable recommendations prioritized by:
- Impact (high/medium/low)
- Effort (easy/medium/hard)
- Quick wins first

# Stage 5: Report Generation
Create comprehensive report with:
- Executive summary (GREEN/YELLOW/RED status)
- Detailed metrics per page
- Trend charts (if possible)
- Top 3 action items
- Full technical details

Use tools systematically and provide evidence-based analysis.
`;
```

### Comparative Analysis Prompt

```typescript
const comparativePrompt = `
Compare AC Heating website (${config.baseUrl}) against competitors:

Competitors:
- https://competitor1.cz
- https://competitor2.cz
- https://competitor3.cz

For each site, measure:
1. Lighthouse scores (all categories)
2. Page load time (median of 3 runs)
3. Total page weight
4. Number of requests
5. Time to Interactive (TTI)

Analysis:
- Rank all sites by overall performance
- Identify where AC Heating leads/lags
- Find specific areas for improvement
- Estimate potential gains from optimizations

Provide competitive benchmarking report with clear metrics comparison.
`;
```

---

## Multi-Environment Monitoring

```typescript
interface Environment {
  name: string;
  baseUrl: string;
  apiKey?: string;
}

const environments: Environment[] = [
  {
    name: 'Development',
    baseUrl: 'http://localhost:3100',
  },
  {
    name: 'Staging',
    baseUrl: 'https://staging.ac-heating.cz',
  },
  {
    name: 'Production',
    baseUrl: 'https://www.ac-heating.cz',
  },
];

async function monitorAllEnvironments() {
  const results: any[] = [];

  for (const env of environments) {
    console.log(`\n🔍 Monitoring ${env.name} environment...`);

    const result = await query({
      prompt: `
Monitor ${env.name} environment (${env.baseUrl}).

Check all critical pages and compare against production baseline.
Identify environment-specific issues.

Environment: ${env.name}
Base URL: ${env.baseUrl}
      `,
      options: {
        model: 'haiku', // Use faster model for dev/staging
        mcpServers: { monitoring: monitoringServer },
        permissionMode: 'bypassPermissions',
      },
    });

    // Collect results
    for await (const msg of result) {
      if (msg.type === 'result' && msg.subtype === 'success') {
        results.push({
          environment: env.name,
          result: msg.result,
          cost: msg.total_cost_usd,
        });
      }
    }
  }

  // Compare environments
  console.log('\n📊 Environment Comparison:\n');
  results.forEach(r => {
    console.log(`${r.environment}: ${r.result}`);
  });
}
```

---

## Performance Budget Integration

```typescript
interface PerformanceBudget {
  metrics: {
    fcp: number; // First Contentful Paint (ms)
    lcp: number; // Largest Contentful Paint (ms)
    tbt: number; // Total Blocking Time (ms)
    cls: number; // Cumulative Layout Shift
    speedIndex: number; // Speed Index
  };
  resources: {
    totalSize: number; // Total page size (KB)
    imageSize: number; // Image size (KB)
    scriptSize: number; // JavaScript size (KB)
    cssSize: number; // CSS size (KB)
  };
  requests: {
    total: number;
    scripts: number;
    images: number;
  };
}

const performanceBudget: PerformanceBudget = {
  metrics: {
    fcp: 1800,
    lcp: 2500,
    tbt: 200,
    cls: 0.1,
    speedIndex: 3000,
  },
  resources: {
    totalSize: 1500,
    imageSize: 800,
    scriptSize: 400,
    cssSize: 100,
  },
  requests: {
    total: 50,
    scripts: 15,
    images: 25,
  },
};

const budgetCheckTool = tool(
  'check_performance_budget',
  'Check if page meets performance budget',
  {
    url: z.string().url(),
    metrics: z.record(z.number()),
  },
  async (args) => {
    const violations: string[] = [];

    // Check each budget constraint
    Object.entries(performanceBudget.metrics).forEach(([metric, budget]) => {
      if (args.metrics[metric] > budget) {
        violations.push(
          `${metric}: ${args.metrics[metric]} exceeds budget ${budget}`
        );
      }
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            passed: violations.length === 0,
            violations,
            budget: performanceBudget,
            actual: args.metrics,
          }),
        },
      ],
      isError: violations.length > 0,
    };
  }
);
```

---

## Visual Regression Testing

```typescript
async function visualRegressionTest() {
  const result = await query({
    prompt: `
Perform visual regression testing for AC Heating website.

Steps:
1. Take screenshots of all critical pages
2. Compare with baseline screenshots
3. Identify visual changes (pixel diff > 5%)
4. Generate visual diff images
5. Report significant changes

Pages to test:
- Homepage (/)
- Products (/produkty)
- Product detail (/produkty/convert-ng-one-l)

Baselines are stored in: ./monitoring/baselines/

Use screenshot_compare tool for each page.
Report any visual regressions with diff percentage.
    `,
    options: {
      model: 'sonnet',
      mcpServers: {
        monitoring: createSdkMcpServer({
          name: 'visual-testing',
          tools: [screenshotCompareTool],
        }),
      },
      permissionMode: 'bypassPermissions',
    },
  });

  for await (const msg of result) {
    if (msg.type === 'result' && msg.subtype === 'success') {
      console.log('Visual regression test result:', msg.result);
    }
  }
}
```

---

## A/B Testing Analysis

```typescript
interface ABTestConfig {
  name: string;
  variants: Array<{
    name: string;
    url: string;
    traffic: number; // percentage
  }>;
  metrics: string[];
  duration: number; // days
}

const abTest: ABTestConfig = {
  name: 'Homepage Hero Optimization',
  variants: [
    {
      name: 'Control',
      url: 'http://91.99.126.53:3100',
      traffic: 50,
    },
    {
      name: 'Variant A - New Hero',
      url: 'http://91.99.126.53:3100?variant=hero-a',
      traffic: 50,
    },
  ],
  metrics: [
    'bounce_rate',
    'time_on_page',
    'conversion_rate',
    'scroll_depth',
  ],
  duration: 14,
};

async function analyzeABTest() {
  const result = await query({
    prompt: `
Analyze A/B test: ${abTest.name}

Variants:
${abTest.variants.map(v => `- ${v.name} (${v.traffic}% traffic): ${v.url}`).join('\n')}

For each variant:
1. Run Lighthouse performance tests
2. Collect custom metrics: ${abTest.metrics.join(', ')}
3. Analyze user engagement signals
4. Compare conversion funnels

Statistical Analysis:
- Calculate statistical significance (p < 0.05)
- Determine winner (if any)
- Estimate expected lift
- Provide confidence interval

Generate comprehensive A/B test report with recommendation.
    `,
    options: {
      model: 'sonnet',
      mcpServers: { monitoring: monitoringServer },
      permissionMode: 'bypassPermissions',
    },
  });

  for await (const msg of result) {
    if (msg.type === 'result' && msg.subtype === 'success') {
      console.log('A/B test analysis:', msg.result);
    }
  }
}
```

---

## Cost Optimization

### Using Model Tiers Strategically

```typescript
const costOptimizedMonitoring = {
  // Use Haiku for simple checks (10x cheaper)
  quickCheck: {
    model: 'haiku',
    tasks: ['lighthouse_check', 'page_content_hash'],
  },

  // Use Sonnet for analysis (balanced)
  regularAnalysis: {
    model: 'sonnet',
    tasks: ['trend_analysis', 'recommendation_generation'],
  },

  // Use Opus only for complex investigations (most expensive)
  deepAnalysis: {
    model: 'opus',
    tasks: ['root_cause_analysis', 'competitive_benchmarking'],
  },
};

async function costOptimizedCheck() {
  // Phase 1: Quick check with Haiku
  console.log('Phase 1: Quick health check (Haiku)...');
  const quickResult = await query({
    prompt: 'Run quick Lighthouse check on all pages',
    options: {
      model: 'haiku',
      mcpServers: { monitoring: monitoringServer },
      permissionMode: 'bypassPermissions',
    },
  });

  let needsDeepAnalysis = false;

  for await (const msg of quickResult) {
    if (msg.type === 'result' && msg.subtype === 'success') {
      // Check if any issues detected
      if (msg.result.includes('RED') || msg.result.includes('degradation')) {
        needsDeepAnalysis = true;
      }
    }
  }

  // Phase 2: Deep analysis only if needed (Sonnet/Opus)
  if (needsDeepAnalysis) {
    console.log('Phase 2: Deep analysis triggered (Sonnet)...');
    await query({
      prompt: 'Investigate performance issues detected in quick check',
      options: {
        model: 'sonnet',
        mcpServers: { monitoring: monitoringServer },
        permissionMode: 'bypassPermissions',
      },
    });
  } else {
    console.log('✅ All checks passed - no deep analysis needed');
  }
}
```

### Caching and Deduplication

```typescript
// Cache recent Lighthouse results
const lighthouseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const cachedLighthouseTool = tool(
  'cached_lighthouse_check',
  'Run Lighthouse with caching',
  {
    url: z.string().url(),
  },
  async (args) => {
    const cacheKey = args.url;
    const cached = lighthouseCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`✅ Cache hit for ${args.url}`);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ ...cached.data, cached: true }),
          },
        ],
      };
    }

    // Run actual Lighthouse check
    const result = await runLighthouse(args.url);

    // Cache result
    lighthouseCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ ...result, cached: false }),
        },
      ],
    };
  }
);
```

---

## Advanced Hooks Usage

```typescript
const monitoringWithHooks = {
  hooks: {
    PreToolUse: [
      {
        hooks: [
          async (input) => {
            // Log all tool uses for audit trail
            console.log(`[AUDIT] Tool: ${input.tool_name}`);
            console.log(`[AUDIT] Input: ${JSON.stringify(input.tool_input)}`);

            return { continue: true };
          },
        ],
      },
    ],
    PostToolUse: [
      {
        hooks: [
          async (input) => {
            // Track tool execution time
            if (input.hook_event_name === 'PostToolUse') {
              console.log(`[PERF] ${input.tool_name} completed`);
            }

            return { continue: true };
          },
        ],
      },
    ],
    SessionEnd: [
      {
        hooks: [
          async (input) => {
            // Generate cost report at end of session
            console.log('[COST] Session ended');
            console.log('[COST] Generate cost breakdown report');

            return { continue: true };
          },
        ],
      },
    ],
  },
};
```

---

## Summary

Tyto pokročilé konfigurace umožňují:

- **Custom MCP tools** pro specifické use cases
- **Multi-environment monitoring** pro dev/staging/prod
- **Performance budgets** pro regression detection
- **Visual regression testing** pro UI consistency
- **A/B testing analysis** pro data-driven decisions
- **Cost optimization** pomocí model tiers a cachingu

Pro více informací viz hlavní README.md a TypeScript SDK dokumentaci.
