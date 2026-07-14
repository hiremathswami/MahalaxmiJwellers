import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, trend, trendValue }) {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-start justify-between">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">{label}</span>
        <span className="text-3xl font-bold text-gray-950 block">{value}</span>
        
        {trendValue && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`inline-flex items-center p-0.5 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            </span>
            <span className={`text-xs font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
              {trendValue}
            </span>
            <span className="text-[10px] font-medium text-gray-400">vs last month</span>
          </div>
        )}
      </div>
      
      {Icon && (
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
