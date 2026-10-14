import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Sprout, 
  Scan, 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  History, 
  Globe2, 
  FileCode2, 
  Home,
  Activity
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { ServerHealthStatus } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  health: ServerHealthStatus | null;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  health,
  historyCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'AI Disease Scanner', icon: Scan },
    { id: 'library', label: 'Disease Library', icon: BookOpen },
    { id: 'assistant', label: 'Crop Advisor', icon: MessageSquare },
    { id: 'history', label: 'Analysis History', icon: History, count: historyCount },
    { id: 'impact', label: 'SDG Impact', icon: Globe2 },
    { id: 'settings', label: 'ML Specs & Internship', icon: FileCode2 },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-lg text-stone-600 hover:bg-stone-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer lg:hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5 text-lime-400" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-emerald-950">AgriSense AI</span>
          </div>

          {/* Desktop Breadcrumb / Active View Title */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-900 capitalize">
              {activeTab === 'landing' ? 'Overview' : activeTab === 'scanner' ? 'AI Crop Disease Scanner' : activeTab.replace('_', ' ')}
            </span>
            <span aria-hidden="true">/</span>
            <span>AgriSense Platform</span>
          </div>
        </div>

        {/* Right header actions */}
        <div className="flex items-center gap-3">
          {/* Engine status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-stone-700">MobileNetV2: 38 Classes Active</span>
          </div>

          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Scan className="w-3.5 h-3.5 text-lime-400" />
            <span>Scan Plant</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
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
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
