export interface SentimentResult {
  text: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number; // 0 to 1
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    excited: number;
    fear: number;
    neutral: number;
  };
  toxicity: {
    score: number; // 0 to 1
    flagged: boolean;
    categories: {
      hateSpeech: boolean;
      abuse: boolean;
      insult: boolean;
    };
  };
  fakeReview: {
    isFake: boolean;
    confidence: number; // 0 to 1
    reasoning: string;
  };
  explainability: {
    wordWeights: { word: string; weight: number }[]; // Positive contributes positive, negative negative
    importantKeywords: string[];
    summaryInsight: string;
  };
}

export interface TrainingParams {
  modelType: 'logistic_regression' | 'naive_bayes' | 'random_forest' | 'rnn_lstm';
  learningRate: number;
  epochs: number;
  testSplit: number;
  ngramMin: number;
  ngramMax: number;
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTimeMs: number;
  confusionMatrix: [[number, number], [number, number]]; // Simple binary matrix [[TP, FN], [FP, TN]]
  classificationReport: {
    positive: { precision: number; recall: number; f1: number };
    negative: { precision: number; recall: number; f1: number };
  };
}

export interface BatchItemResult {
  id: string;
  text: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  toxicityScore: number;
  primaryEmotion: string;
  isFake: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  text: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  source: 'single' | 'batch' | 'api';
}
