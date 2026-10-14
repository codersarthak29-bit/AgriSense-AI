/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { DiseaseLibraryPage } from './pages/DiseaseLibraryPage';
import { AssistantPage } from './pages/AssistantPage';
import { HistoryPage } from './pages/HistoryPage';
import { ImpactPage } from './pages/ImpactPage';
import { SettingsPage } from './pages/SettingsPage';
import { AnalysisResult, CropCatalogItem, ServerHealthStatus } from './types';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [crops, setCrops] = useState<CropCatalogItem[]>([]);
  const [health, setHealth] = useState<ServerHealthStatus | null>(null);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Initial data load
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [healthData, cropsData, historyData] = await Promise.all([
        api.getHealth(),
        api.getCrops(),
        api.getHistory()
      ]);
      setHealth(healthData);
      setCrops(cropsData);
      setHistory(historyData);
    } catch (err) {
      console.warn('Initial load fallback:', err);
    }
  };

  const handleAnalysisComplete = (newResult: AnalysisResult) => {
    setHistory(prev => [newResult, ...prev]);
  };

  const handleDeleteHistoryRecord = async (id: string) => {
    try {
      await api.deleteHistoryItem(id);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error('Delete history error:', err);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.clearHistory();
      setHistory([]);
    } catch (err) {
      console.error('Clear history error:', err);
    }
  };

  const handleSelectResult = (result: AnalysisResult) => {
    setSelectedResult(result);
    setActiveTab('scanner');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] flex text-stone-800">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          health={health}
          historyCount={history.length}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'landing' && (
            <LandingPage
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage
              history={history}
              crops={crops}
              onNavigate={setActiveTab}
              onSelectResult={handleSelectResult}
            />
          )}

          {activeTab === 'scanner' && (
            <ScannerPage
              crops={crops}
              onAnalysisComplete={handleAnalysisComplete}
              geminiAvailable={Boolean(health?.gemini_api_configured)}
            />
          )}

          {activeTab === 'library' && (
            <DiseaseLibraryPage
              crops={crops}
              onScanWithCrop={(cropName) => {
                setActiveTab('scanner');
              }}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantPage />
          )}

          {activeTab === 'history' && (
            <HistoryPage
              history={history}
              onDeleteRecord={handleDeleteHistoryRecord}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'impact' && (
            <ImpactPage history={history} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              health={health}
              onClearHistory={handleClearHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}
