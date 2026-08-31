export interface RiskResult {
  riskScore: number; // 0, 1, 2
  riskLabel: 'SAFE' | 'WARNING' | 'DANGER';
  diseaseRiskPercent: number;
  recommendation: string;
  solution: string;
}

export function evaluateWaterRisk(ph: number, tds: number, turbidity: number): RiskResult {
  let score = 0;
  let reasons: string[] = [];

  // Config bounds: pH: 6.5-8.5, TDS: <=500, Turbidity: <=5
  if (ph < 6.5 || ph > 8.5) {
    score += (ph < 6.0 || ph > 9.0) ? 2 : 1;
    reasons.push(ph < 6.5 ? 'Acidic pH' : 'Alkaline pH');
  }

  if (tds > 500) {
    score += (tds > 800) ? 2 : 1;
    reasons.push('High TDS');
  }

  if (turbidity > 5.0) {
    score += (turbidity > 10.0) ? 2 : 1;
    reasons.push('High Turbidity');
  }

  if (score === 0) {
    return {
      riskScore: 0,
      riskLabel: 'SAFE',
      diseaseRiskPercent: 12,
      recommendation: 'Water quality is stable. No immediate action is required.',
      solution: 'Maintain routine periodic monitoring and regular distribution network hygiene.'
    };
  } else if (score <= 2) {
    return {
      riskScore: 1,
      riskLabel: 'WARNING',
      diseaseRiskPercent: 42,
      recommendation: `Elevated variance detected (${reasons.join(', ')}). Monitor source closely.`,
      solution: 'Inspect local storage tanks, run secondary filtration, and re-test within 6 hours.'
    };
  } else {
    return {
      riskScore: 2,
      riskLabel: 'DANGER',
      diseaseRiskPercent: 84,
      recommendation: `Critical contamination risk (${reasons.join(', ')}). Water unsafe for direct usage.`,
      solution: 'Halt consumption immediately. Initiate chlorination, sediment settling, and full line inspection.'
    };
  }
}