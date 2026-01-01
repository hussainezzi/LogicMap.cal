
import * as math from 'mathjs';
import { Alternative, Criterion, ScoreMap, EngineOutput, DecisionResult } from '../types';

/**
 * LogicMap Cognitive Engine
 * Implements d = f : A × C → A
 * Based on Dr. Yingxu Wang's Cognitive Informatics
 */

export const calculateCognitiveCalculus = (
  alternatives: Alternative[],
  criteria: Criterion[],
  scores: ScoreMap
): EngineOutput => {
  if (alternatives.length === 0 || criteria.length === 0) {
    return { results: [], certaintyIndex: 0, normalizedWeights: {} };
  }

  // 1. Weight Normalization: Scale c ∈ C so Σw = 1
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const normalizedWeights: { [id: string]: number } = {};
  criteria.forEach((c) => {
    normalizedWeights[c.id] = totalWeight > 0 ? c.weight / totalWeight : 1 / criteria.length;
  });

  // 2. Build Matrices
  // Matrix A: Alternatives (rows) x Criteria (cols)
  const aMatrix = alternatives.map((alt) => {
    return criteria.map((crit) => scores[alt.id]?.[crit.id] || 0);
  });

  // Vector W: Criterion Weights
  const wVector = criteria.map((crit) => normalizedWeights[crit.id]);

  // 3. Perform Matrix Multiplication: Result = A_scores × C_weights^T
  // Using mathjs for precision and formal matrix algebra
  try {
    const scoresResult = math.multiply(aMatrix, wVector) as number[];

    // 4. Map results and Rank
    const results: DecisionResult[] = alternatives.map((alt, index) => ({
      alternativeId: alt.id,
      name: alt.name,
      score: scoresResult[index],
      rank: 0,
    }));

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    results.forEach((res, idx) => (res.rank = idx + 1));

    // 5. Certainty Index calculation
    // Based on variance between top two results
    let certaintyIndex = 0;
    if (results.length >= 2) {
      const delta = results[0].score - results[1].score;
      // Normalized between 0 and 1, assuming max score is 10
      certaintyIndex = Math.min(delta / 5, 1); 
    }

    return {
      results,
      certaintyIndex,
      normalizedWeights,
    };
  } catch (err) {
    console.error("Calculus Engine Error:", err);
    return { results: [], certaintyIndex: 0, normalizedWeights: {} };
  }
};

/**
 * Analyzes how sensitive the decision is to shifts in criteria weight.
 */
export const analyzeSensitivity = (
  alternatives: Alternative[],
  criteria: Criterion[],
  scores: ScoreMap,
  threshold: number = 0.1 // 10% change
): string | null => {
  const base = calculateCognitiveCalculus(alternatives, criteria, scores);
  if (base.results.length < 2) return null;

  const winnerId = base.results[0].alternativeId;

  for (const crit of criteria) {
    // Test a +10% shift in this criterion's raw weight
    const modifiedCriteria = criteria.map(c => 
      c.id === crit.id ? { ...c, weight: c.weight * (1 + threshold) } : c
    );
    
    const testResult = calculateCognitiveCalculus(alternatives, modifiedCriteria, scores);
    if (testResult.results[0].alternativeId !== winnerId) {
      return `If "${crit.name}" changed by ${Math.round(threshold * 100)}%, your decision would flip to "${testResult.results[0].name}".`;
    }

    // Test a -10% shift
    const modifiedCriteriaNeg = criteria.map(c => 
      c.id === crit.id ? { ...c, weight: c.weight * (1 - threshold) } : c
    );
    
    const testResultNeg = calculateCognitiveCalculus(alternatives, modifiedCriteriaNeg, scores);
    if (testResultNeg.results[0].alternativeId !== winnerId) {
      return `If emphasis on "${crit.name}" decreased by ${Math.round(threshold * 100)}%, your decision would flip to "${testResultNeg.results[0].name}".`;
    }
  }

  return "The decision remains stable within a 10% variance in criteria weighting.";
};
