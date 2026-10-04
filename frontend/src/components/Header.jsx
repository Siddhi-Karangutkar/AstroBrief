import React from 'react';
import { Database, Zap, BrainCircuit } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
          <Zap className="text-space-900" size={20} />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
          AstroBrief
        </h1>
      </div>
      
      <div className="hidden md:flex items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-2 bg-space-800/80 px-3 py-1.5 rounded-full border border-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <Database size={14} className="text-gray-400" />
          <span className="text-gray-300">SQLite3</span>
        </div>
        
        <div className="flex items-center gap-2 bg-space-800/80 px-3 py-1.5 rounded-full border border-white/5">
          <BrainCircuit size={14} className="text-neon-cyan" />
          <span className="text-gray-300">Extractive: <span className="text-neon-cyan">TF-IDF</span></span>
        </div>
        
        <div className="flex items-center gap-2 bg-space-800/80 px-3 py-1.5 rounded-full border border-white/5">
          <BrainCircuit size={14} className="text-neon-purple" />
          <span className="text-gray-300">Abstractive: <span className="text-neon-purple">DistilBART</span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
