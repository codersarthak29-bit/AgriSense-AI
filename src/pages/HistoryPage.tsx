import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  Cpu, 
  Sparkles, 
  Filter,
  Download,
  X
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { DiagnosticCard } from '../components/DiagnosticCard';

interface HistoryPageProps {
  history: AnalysisResult[];
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onDeleteRecord,
  onClearHistory
}) => {
  const [search, setSearch] = useState('');
  const [filterCondition, setFilterCondition] = useState<'all' | 'healthy' | 'diseased'>('all');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [activeModalRecord, setActiveModalRecord] = useState<AnalysisResult | null>(null);

  // Extract unique crops from history
  const uniqueCrops = Array.from(new Set(history.map(h => h.crop_name)));

  // Filter records
  const filteredRecords = history.filter(item => {
    if (filterCondition === 'healthy' && !item.is_healthy) return false;
    if (filterCondition === 'diseased' && item.is_healthy) return false;
    if (selectedCrop !== 'all' && item.crop_name !== selectedCrop) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = item.disease_name.toLowerCase().includes(q);
      const matchCrop = item.crop_name.toLowerCase().includes(q);
      const matchSummary = item.diagnosis_summary.toLowerCase().includes(q);
      return matchName || matchCrop || matchSummary;
    }
    return true;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `agrisense_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            Analysis History Log
          </h1>
          <p className="text-xs md:text-sm text-stone-600 mt-1">
            Permanent record of foliar classifications, confidence scores, and crop care prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all analysis history records?')) {
                    onClearHistory();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by crop, disease, or symptoms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-stone-400"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            >
              <option value="all">All Crops ({history.length})</option>
              {uniqueCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value as any)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            >
              <option value="all">All Conditions</option>
              <option value="healthy">Healthy Only</option>
              <option value="diseased">Diseased / Symptoms</option>
            </select>
          </div>
        </div>

        {/* Storage status notice */}
        <div className="flex items-center justify-between text-[11px] text-stone-700 pt-2 border-t border-stone-100">
          <span>Showing {filteredRecords.length} of {history.length} records</span>
          <span>Storage: Server-backed JSON persistence</span>
        </div>
      </div>

      {/* Records Table / List */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-700 text-xs space-y-2">
          <History className="w-8 h-8 mx-auto text-stone-400" />
          <p className="font-semibold text-stone-800">No matching scan history records.</p>
          <p>Scan a plant in the AI Scanner to automatically log records here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail if present or status icon */}
                {item.imageUrl ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <img src={item.imageUrl} alt={item.disease_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    item.is_healthy 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : item.severity === 'Severe' || item.severity === 'Critical'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.is_healthy ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : item.severity === 'Severe' || item.severity === 'Critical' ? (
                      <ShieldAlert className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <span className="font-semibold text-emerald-950 uppercase">{item.crop_name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.analysis_mode === 'mobilenet_v2_classifier' ? 'MobileNetV2' : 'Gemini Vision'}</span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {item.disease_name}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-1 max-w-2xl">
                    {item.diagnosis_summary}
                  </p>
                </div>
              </div>

              {/* Confidence, Severity, and Actions */}
              <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 text-xs">
                <div className="text-left md:text-right">
                  <div className="font-bold text-stone-900">
                    {(item.confidence * 100).toFixed(1)}% Confidence
                  </div>
                  <div className="text-[11px] text-stone-700">
                    Severity: <span className={item.is_healthy ? 'text-emerald-700 font-semibold' : 'text-amber-800 font-semibold'}>{item.severity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalRecord(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>

                  <button
                    onClick={() => onDeleteRecord(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Modal Viewer */}
      {activeModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-stone-900">Historical Diagnostic Record</h3>
                <span className="text-xs text-stone-700">Archived Scan ID: {activeModalRecord.id}</span>
              </div>
              <button
                onClick={() => setActiveModalRecord(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DiagnosticCard result={activeModalRecord} />

            <div className="flex justify-end">
              <button
                onClick={() => setActiveModalRecord(null)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
