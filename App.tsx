
import React from 'react';
import { CartesianMatrix } from './components/CartesianMatrix';
import { WeightingLab } from './components/WeightingLab';
import { ResultsDashboard } from './components/ResultsDashboard';
import { BrainCircuit, BookOpen, Layers } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <BrainCircuit size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">LogicMap<span className="text-indigo-600 italic">.cal</span></h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Cognitive Calculus Engine v1.5</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            <a href="#" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              <BookOpen size={14} /> Documentation
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              <Layers size={14} /> Cognitive Informatics
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero / Intro Section */}
        <section className="mb-12 border-l-2 border-slate-900 pl-8">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Formal Decision Architecture
          </h2>
          <p className="max-w-3xl text-slate-500 leading-relaxed">
            LogicMap implements Dr. Yingxu Wang’s Cognitive Calculus, representing decision-making as a formal mapping 
            between the Alternative Space <span className="mono font-bold text-slate-700">A</span> and the Criterion Space 
            <span className="mono font-bold text-slate-700">C</span>. By quantifying the intensity of selections, we derive 
            objective deterministic results.
          </p>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Left Column: Inputs */}
          <div className="xl:col-span-8 space-y-8">
            <section>
              <CartesianMatrix />
            </section>
            
            <section>
              <ResultsDashboard />
            </section>
          </div>

          {/* Right Column: Weighting Lab (Sticky) */}
          <div className="xl:col-span-4">
            <aside className="sticky top-28">
              <WeightingLab />
              
              <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Mathematical Formula</h4>
                <div className="bg-white p-4 rounded border border-slate-200 font-mono text-xs text-slate-600 text-center select-none">
                  d = f : A &times; C &rarr; A
                  <div className="mt-2 text-slate-300">A = {`{a₁, a₂, ..., aₙ}`}</div>
                  <div className="text-slate-300">C = {`{c₁, c₂, ..., cₘ}`}</div>
                </div>
                <p className="mt-4 text-[11px] text-slate-400 italic">
                  &quot;Optimal decision-making is not a feeling, but a rigorous sequence of Cartesian-product-based selections.&quot;
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-slate-400 font-mono uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Engine Active</span>
            <span>Precision: Float64</span>
          </div>
          <div>LogicMap &copy; 2024 Cognitive Science Dept.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
