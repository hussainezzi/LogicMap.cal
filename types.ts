
export interface Alternative {
  id: string;
  name: string;
}

export interface Criterion {
  id: string;
  name: string;
  weight: number; // 0 to 1 after normalization
}

export interface ScoreMap {
  [alternativeId: string]: {
    [criterionId: string]: number; // Intensity Score 1-10
  };
}

export interface DecisionResult {
  alternativeId: string;
  name: string;
  score: number;
  rank: number;
}

export interface EngineOutput {
  results: DecisionResult[];
  certaintyIndex: number;
  normalizedWeights: { [id: string]: number };
}

export interface SensitivityFlip {
  criterionId: string;
  criterionName: string;
  originalWinner: string;
  newWinner: string;
  changePercent: number;
}
