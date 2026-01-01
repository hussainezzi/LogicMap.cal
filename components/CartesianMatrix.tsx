
import React from 'react';
import { useDecisionStore } from '../store/useDecisionStore';
import { Plus, Trash2 } from 'lucide-react';

export const CartesianMatrix: React.FC = () => {
  const { 
    alternatives, 
    criteria, 
    scores, 
    setScore, 
    addAlternative, 
    removeAlternative,
    updateAlternative,
    removeCriterion,
    addCriterion,
    updateCriterionName
  } = useDecisionStore();

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Cartesian Intensity Matrix</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => addCriterion('New Criterion')}
            className="flex items-center gap-1 text-xs px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <Plus size={14} /> Add Criterion
          </button>
          <button 
            onClick={() => addAlternative('New Alternative')}
            className="flex items-center gap-1 text-xs px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <Plus size={14} /> Add Alternative
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-slate-200 bg-slate-50/50 w-48">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Alternatives \ Criteria</span>
              </th>
              {criteria.map((crit) => (
                <th key={crit.id} className="p-4 border-b border-r border-slate-200 min-w-[120px]">
                  <div className="flex items-center justify-between group">
                    <input 
                      type="text" 
                      value={crit.name}
                      onChange={(e) => updateCriterionName(crit.id, e.target.value)}
                      className="bg-transparent font-semibold text-slate-700 outline-none w-full mr-2 focus:ring-1 focus:ring-slate-300 rounded px-1"
                    />
                    <button 
                      onClick={() => removeCriterion(crit.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alternatives.map((alt) => (
              <tr key={alt.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 border-b border-r border-slate-200">
                  <div className="flex items-center justify-between group">
                    <input 
                      type="text" 
                      value={alt.name}
                      onChange={(e) => updateAlternative(alt.id, e.target.value)}
                      className="bg-transparent font-medium text-slate-600 outline-none w-full mr-2 focus:ring-1 focus:ring-slate-300 rounded px-1"
                    />
                    <button 
                      onClick={() => removeAlternative(alt.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
                {criteria.map((crit) => (
                  <td key={crit.id} className="p-4 border-b border-r border-slate-200">
                    <input 
                      type="number"
                      min="1"
                      max="10"
                      value={scores[alt.id]?.[crit.id] || 0}
                      onChange={(e) => setScore(alt.id, crit.id, parseInt(e.target.value) || 0)}
                      className="w-full text-center font-mono text-lg bg-slate-100/50 border border-slate-200 rounded py-1 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
