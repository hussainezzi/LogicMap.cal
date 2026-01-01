
import { create } from 'zustand';
import { Alternative, Criterion, ScoreMap } from '../types';

interface DecisionStore {
  alternatives: Alternative[];
  criteria: Criterion[];
  scores: ScoreMap;
  isZeroSum: boolean;
  
  addAlternative: (name: string) => void;
  removeAlternative: (id: string) => void;
  updateAlternative: (id: string, name: string) => void;
  
  addCriterion: (name: string) => void;
  removeCriterion: (id: string) => void;
  updateCriterionName: (id: string, name: string) => void;
  updateWeight: (id: string, newWeight: number) => void;
  
  setScore: (altId: string, critId: string, value: number) => void;
  toggleZeroSum: () => void;
}

export const useDecisionStore = create<DecisionStore>((set) => ({
  alternatives: [
    { id: 'a1', name: 'Option Alpha' },
    { id: 'a2', name: 'Option Beta' }
  ],
  criteria: [
    { id: 'c1', name: 'Cost/Efficiency', weight: 0.5 },
    { id: 'c2', name: 'Technical Risk', weight: 0.5 }
  ],
  scores: {
    'a1': { 'c1': 8, 'c2': 4 },
    'a2': { 'c1': 5, 'c2': 9 }
  },
  isZeroSum: false,

  addAlternative: (name) => set((state) => ({
    alternatives: [...state.alternatives, { id: Math.random().toString(36).substr(2, 9), name }]
  })),

  removeAlternative: (id) => set((state) => ({
    alternatives: state.alternatives.filter(a => a.id !== id)
  })),

  updateAlternative: (id, name) => set((state) => ({
    alternatives: state.alternatives.map(a => a.id === id ? { ...a, name } : a)
  })),

  addCriterion: (name) => set((state) => ({
    criteria: [...state.criteria, { id: Math.random().toString(36).substr(2, 9), name, weight: 0.5 }]
  })),

  removeCriterion: (id) => set((state) => ({
    criteria: state.criteria.filter(c => c.id !== id)
  })),

  updateCriterionName: (id, name) => set((state) => ({
    criteria: state.criteria.map(c => c.id === id ? { ...c, name } : c)
  })),

  updateWeight: (id, newWeight) => set((state) => {
    if (!state.isZeroSum) {
      return {
        criteria: state.criteria.map(c => c.id === id ? { ...c, weight: newWeight } : c)
      };
    }

    // Zero-Sum logic: increasing one decreases others proportionally
    const currentCrit = state.criteria.find(c => c.id === id);
    if (!currentCrit) return state;

    const diff = newWeight - currentCrit.weight;
    const otherCriteria = state.criteria.filter(c => c.id !== id);
    const totalOtherWeight = otherCriteria.reduce((sum, c) => sum + c.weight, 0);

    if (totalOtherWeight === 0 && otherCriteria.length > 0) {
      const split = diff / otherCriteria.length;
      return {
        criteria: state.criteria.map(c => {
          if (c.id === id) return { ...c, weight: newWeight };
          return { ...c, weight: Math.max(0, c.weight - split) };
        })
      };
    }

    return {
      criteria: state.criteria.map(c => {
        if (c.id === id) return { ...c, weight: newWeight };
        const proportion = c.weight / totalOtherWeight;
        return { ...c, weight: Math.max(0, c.weight - (diff * proportion)) };
      })
    };
  }),

  setScore: (altId, critId, value) => set((state) => ({
    scores: {
      ...state.scores,
      [altId]: {
        ...(state.scores[altId] || {}),
        [critId]: value
      }
    }
  })),

  toggleZeroSum: () => set((state) => ({ isZeroSum: !state.isZeroSum }))
}));
