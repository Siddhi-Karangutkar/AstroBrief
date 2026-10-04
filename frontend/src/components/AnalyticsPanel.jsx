import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, Database, TrendingDown, FileText } from 'lucide-react';

const AnalyticsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getAnalytics();
        setData(stats);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-neon-cyan" size={32} />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-gray-400 py-10">Failed to load analytics data.</div>;
  }

  // Take top 25 terms for chart readability
  const chartData = data.vocabulary_stats?.top_terms?.slice(0, 25) || [];

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-neon-cyan/10 rounded-lg text-neon-cyan">
            <Database size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Corpus Size</p>
            <h3 className="text-2xl font-bold text-white">{data.total_articles} <span className="text-sm font-normal text-gray-500">articles</span></h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-neon-purple/10 rounded-lg text-neon-purple">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Avg Compression</p>
            <h3 className="text-2xl font-bold text-white">{data.average_compression_ratio}</h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tokens Filtered</p>
            <h3 className="text-2xl font-bold text-white">
              {data.vocabulary_stats?.total_tokens_removed?.toLocaleString() || 0}
            </h3>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Linguistic Term Frequency</h2>
          <p className="text-xs text-gray-400 mt-1">Top 25 normalized unigrams (excluding stop words)</p>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis 
                dataKey="text" 
                type="category" 
                stroke="#334155" 
                tick={{ fill: '#cbd5e1', fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: 'rgba(13, 19, 34, 0.9)', borderColor: 'rgba(0, 242, 254, 0.3)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? '#00F2FE' : index < 10 ? '#4FACFE' : '#334155'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
