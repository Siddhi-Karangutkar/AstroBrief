import React, { useState } from 'react';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import LivePlayground from './components/LivePlayground';
import AnalyticsPanel from './components/AnalyticsPanel';
import { Newspaper, TerminalSquare, LineChart } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('wire');

  return (
    <div className="min-h-screen bg-space-900 text-white relative">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-cyan/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-6 py-8">
          {/* Tab Navigation */}
          <div className="flex space-x-1 glass-panel p-1 rounded-lg w-fit mx-auto mb-10">
            <button
              onClick={() => setActiveTab('wire')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'wire' 
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Newspaper size={16} className={activeTab === 'wire' ? 'text-neon-cyan' : ''} />
              News Wire
            </button>
            <button
              onClick={() => setActiveTab('workbench')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'workbench' 
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <TerminalSquare size={16} className={activeTab === 'workbench' ? 'text-neon-cyan' : ''} />
              NLP Workbench
            </button>
            <button
              onClick={() => setActiveTab('eda')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'eda' 
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <LineChart size={16} className={activeTab === 'eda' ? 'text-neon-cyan' : ''} />
              Linguistic EDA
            </button>
          </div>

          {/* Content Area */}
          <div className="w-full max-w-7xl mx-auto">
            {activeTab === 'wire' && <NewsFeed />}
            {activeTab === 'workbench' && <LivePlayground />}
            {activeTab === 'eda' && <AnalyticsPanel />}
          </div>
        </main>
        
        <footer className="py-6 border-t border-white/5 mt-auto">
          <div className="container mx-auto px-6 text-center text-xs text-gray-500">
            AstroBrief AI Summarization Platform &copy; 2026. Built for aerospace intelligence.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
