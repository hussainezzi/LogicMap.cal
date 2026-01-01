
import React, { useMemo, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDecisionStore } from '../store/useDecisionStore';
import { calculateCognitiveCalculus, analyzeSensitivity } from '../logic/engine';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Activity, AlertCircle } from 'lucide-react';

export const ResultsDashboard: React.FC = () => {
  const { alternatives, criteria, scores } = useDecisionStore();
  const [lastWinnerId, setLastWinnerId] = useState<string | null>(null);

  const engineOutput = useMemo(() => 
    calculateCognitiveCalculus(alternatives, criteria, scores),
    [alternatives, criteria, scores]
  );

  const sensitivityText = useMemo(() => 
    analyzeSensitivity(alternatives, criteria, scores),
    [alternatives, criteria, scores]
  );

  const winner = engineOutput.results[0];
  
  useEffect(() => {
    if (winner && winner.alternativeId !== lastWinnerId) {
      setLastWinnerId(winner.alternativeId);
    }
  }, [winner, lastWinnerId]);

  if (engineOutput.results.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Outcome Validity Spectrum</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engineOutput.results} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 10]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                  {engineOutput.results.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Certainty & Winner Panel */}
        <div className="bg-slate-900 text-white rounded-lg shadow-lg p-8 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={120} />
          </div>
          
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Trophy size={18} />
              <span className="text-xs font-bold uppercase tracking-tighter">Optimal Selection</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={winner.alternativeId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative"
              >
                <h1 className="text-3xl font-bold tracking-tight mb-2 leading-tight">
                  {winner.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-mono text-indigo-400">{winner.score.toFixed(2)}</div>
                  <div className="h-8 w-px bg-slate-700" />
                  <div className="text-xs uppercase text-slate-400">
                    Confidence<br/>Index
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12">
            <div className="flex justify-between text-[10px] uppercase text-slate-500 font-bold mb-2">
              <span>Determinism Index</span>
              <span>{Math.round(engineOutput.certaintyIndex * 100)}%</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${engineOutput.certaintyIndex * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis Block */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-4 items-start">
        <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">Sensitivity Analysis</h3>
          <p className="text-sm text-amber-800 leading-relaxed italic">
            {sensitivityText || "Stable Calculus detected. No single 10% variance flip point identified."}
          </p>
        </div>
      </div>
    </div>
  );
};
