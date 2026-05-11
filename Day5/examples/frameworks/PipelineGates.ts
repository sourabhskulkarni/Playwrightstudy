// PipelineGates.ts
// Quality gate system that blocks deployment when AI output fails critical thresholds

export interface GateConfig {
  name: string;
  metric: string;
  threshold: number;
  direction: 'above' | 'below'; // 'above' = value must be >= threshold, 'below' = must be <= threshold
  severity: 'critical' | 'warning';
}

export interface GateResult {
  name: string;
  metric: string;
  actualValue: number;
  threshold: number;
  passed: boolean;
  severity: 'critical' | 'warning';
  message: string;
}

export interface PipelineGateReport {
  allGatesPassed: boolean;
  criticalFailures: number;
  warnings: number;
  gates: GateResult[];
  recommendation: 'deploy' | 'review' | 'block';
  summary: string;
}

export class PipelineGates {
  private gates: GateConfig[];

  constructor(gates?: GateConfig[]) {
    this.gates = gates || this.getDefaultGates();
  }

  /**
   * Evaluate all gates against provided metrics
   */
  evaluate(metrics: Record<string, number>): PipelineGateReport {
    const results: GateResult[] = [];

    for (const gate of this.gates) {
      const actualValue = metrics[gate.metric];
      if (actualValue === undefined) {
        results.push({
          name: gate.name, metric: gate.metric, actualValue: -1,
          threshold: gate.threshold, passed: false, severity: gate.severity,
          message: `Metric "${gate.metric}" not provided`
        });
        continue;
      }

      const passed = gate.direction === 'above'
        ? actualValue >= gate.threshold
        : actualValue <= gate.threshold;

      const direction = gate.direction === 'above' ? '>=' : '<=';
      results.push({
        name: gate.name, metric: gate.metric, actualValue,
        threshold: gate.threshold, passed, severity: gate.severity,
        message: passed
          ? `✅ ${gate.name}: ${actualValue.toFixed(3)} ${direction} ${gate.threshold}`
          : `❌ ${gate.name}: ${actualValue.toFixed(3)} failed ${direction} ${gate.threshold}`
      });
    }

    const criticalFailures = results.filter(r => !r.passed && r.severity === 'critical').length;
    const warnings = results.filter(r => !r.passed && r.severity === 'warning').length;
    const allPassed = criticalFailures === 0 && warnings === 0;

    let recommendation: 'deploy' | 'review' | 'block';
    if (criticalFailures > 0) recommendation = 'block';
    else if (warnings > 0) recommendation = 'review';
    else recommendation = 'deploy';

    return {
      allGatesPassed: allPassed,
      criticalFailures, warnings, gates: results, recommendation,
      summary: `${results.filter(r => r.passed).length}/${results.length} gates passed. ` +
        `Critical failures: ${criticalFailures}, Warnings: ${warnings}. ` +
        `Recommendation: ${recommendation.toUpperCase()}`
    };
  }

  /**
   * Add a custom gate
   */
  addGate(gate: GateConfig): void {
    this.gates.push(gate);
  }

  /**
   * Get the default quality gates for Gen AI pipelines
   */
  private getDefaultGates(): GateConfig[] {
    return [
      { name: 'Quality Score Gate', metric: 'qualityScore', threshold: 0.85, direction: 'above', severity: 'critical' },
      { name: 'Hallucination Rate Gate', metric: 'hallucinationRate', threshold: 5, direction: 'below', severity: 'critical' },
      { name: 'Groundedness Gate', metric: 'groundednessScore', threshold: 0.8, direction: 'above', severity: 'critical' },
      { name: 'Latency P95 Gate', metric: 'latencyP95Ms', threshold: 5000, direction: 'below', severity: 'warning' },
      { name: 'Cost Per Request Gate', metric: 'costPerRequest', threshold: 0.05, direction: 'below', severity: 'warning' },
      { name: 'Safety Score Gate', metric: 'safetyScore', threshold: 1.0, direction: 'above', severity: 'critical' }
    ];
  }
}
