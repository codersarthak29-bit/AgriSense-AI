import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Scan, 
  BookOpen, 
  MessageSquare, 
  History, 
  Globe2, 
  Settings, 
  Sprout, 
  CheckCircle,
  FileCode2,
  ExternalLink
} from 'lucide-react';
import { ServerHealthStatus } from '../types';

export type ActiveTab = 'landing' | 'dashboard' | 'scanner' | 'library' | 'assistant' | 'history' | 'impact' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  health: ServerHealthStatus | null;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  health,
  historyCount
}) => {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'AI Disease Scanner', icon: Scan, highlight: true },
    { id: 'library', label: 'Disease Library', icon: BookOpen },
    { id: 'assistant', label: 'Crop Care Advisor', icon: MessageSquare },
    { id: 'history', label: 'Analysis History', icon: History, count: historyCount },
    { id: 'impact', label: 'SDG Impact', icon: Globe2 },
    { id: 'settings', label: 'ML Specs & Internship', icon: FileCode2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 hidden lg:flex">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-stone-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-6 h-6 text-lime-400" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-emerald-950 flex items-center gap-1.5">
              <span>AgriSense</span>
              <span className="text-lime-600 font-bold text-xs uppercase px-1.5 py-0.5 bg-lime-50 rounded border border-lime-200">AI</span>
            </div>
            <p className="text-[11px] text-stone-700 font-medium tracking-tight">Smarter Farming. Healthier Crops.</p>
          </div>
        </div>

        {/* Quick CTA */}
        <div className="p-4">
          <button
            onClick={() => setActiveTab('scanner')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Scan className="w-4 h-4 text-lime-400" />
            <span>New Crop Analysis</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    {item.count}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-lime-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Model Status & SDG Alignment Footer */}
      <div className="p-4 border-t border-stone-100 space-y-3 bg-stone-50/50">
        <div className="text-[11px] text-stone-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-stone-700">Model Engine:</span>
            <span className="font-semibold text-emerald-900">MobileNetV2 CNN</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-700">Gemini Vision:</span>
            <span className={`font-semibold ${health?.gemini_api_configured ? 'text-emerald-700' : 'text-amber-700'}`}>
              {health?.gemini_api_configured ? 'Ready (3.8 Flash)' : 'Fallback Mode'}
            </span>
          </div>
        </div>

        {/* UN SDG Alignment Footer */}
        <div className="pt-2 border-t border-stone-200/60 text-[10px] text-stone-700 space-y-1">
          <div className="font-semibold text-stone-700 uppercase tracking-wider text-[9px]">Supporting UN SDGs:</div>
          <div className="flex items-center gap-1.5 text-stone-600 font-medium">
            <span>SDG 2 (Zero Hunger)</span>
            <span aria-hidden="true">·</span>
            <span>SDG 12</span>
            <span aria-hidden="true">·</span>
            <span>SDG 15</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
