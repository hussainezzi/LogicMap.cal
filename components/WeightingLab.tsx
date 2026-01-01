
import React from 'react';
import { useDecisionStore } from '../store/useDecisionStore';
import { Zap } from 'lucide-react';

export const WeightingLab: React.FC = () => {
  const { criteria, updateWeight, isZeroSum, toggleZeroSum } = useDecisionStore();

  const totalRawWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Weighting Laboratory</h2>
          <p className="text-xs text-slate-400 mt-1">Configure mental energy distribution across criteria</p>
        </div>
        <button 
          onClick={toggleZeroSum}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            isZeroSum 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Zap size={14} className={isZeroSum ? 'animate-pulse' : ''} />
          {isZeroSum ? 'Zero-Sum: ON' : 'Zero-Sum: OFF'}
        </button>
      </div>

      <div className="space-y-6">
        {criteria.map((crit) => {
          const normalized = totalRawWeight > 0 ? (crit.weight / totalRawWeight) * 100 : 0;
          return (
            <div key={crit.id} className="group">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-slate-700">{crit.name}</span>
                <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {normalized.toFixed(1)}% Impact
                </span>
              </div>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={crit.weight}
                onChange={(e) => updateWeight(crit.id, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
          <span>Total Theoretical Load</span>
          <span>{isZeroSum ? '100% Constant' : 'Variable Calculus'}</span>
        </div>
      </div>
    </div>
  );
};
