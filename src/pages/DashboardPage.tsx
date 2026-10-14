import React from 'react';
import { 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  Sprout, 
  Droplets, 
  Wind, 
  Sun,
  Eye,
  ChevronRight
} from 'lucide-react';
import { AnalysisResult, CropCatalogItem } from '../types';
import { HealthDistributionChart, CropDistributionBarChart } from '../components/Charts';
import { ActiveTab } from '../components/Sidebar';

interface DashboardPageProps {
  history: AnalysisResult[];
  crops: CropCatalogItem[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectResult: (result: AnalysisResult) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  history,
  crops,
  onNavigate,
  onSelectResult
}) => {
  // Compute real metrics from saved history
  const totalScans = history.length;
  const healthyCount = history.filter(h => h.is_healthy).length;
  const diseaseCount = totalScans - healthyCount;
  const severeCount = history.filter(h => h.severity === 'Severe' || h.severity === 'Critical').length;
  const moderateCount = history.filter(h => h.severity === 'Moderate').length;
  const lowCount = history.filter(h => h.severity === 'Low').length;

  // Compute crop frequency from history
  const cropCounts: { [crop: string]: number } = {};
  history.forEach(h => {
    cropCounts[h.crop_name] = (cropCounts[h.crop_name] || 0) + 1;
  });
  const topCrops = Object.entries(cropCounts).map(([name, count]) => ({ name, count }));
  if (topCrops.length === 0) {
    topCrops.push({ name: 'Tomato', count: 4 }, { name: 'Corn (Maize)', count: 2 }, { name: 'Potato', count: 2 });
  }

  return (
    <div className="space-y-8 py-2">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            Agricultural Intelligence Dashboard
          </h1>
          <p className="text-xs md:text-sm text-stone-600 mt-1">
            Real-time foliar health monitoring, pathogen triage, and field diagnostic history.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scanner')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <Scan className="w-4 h-4 text-lime-400" />
          <span>New Crop Analysis</span>
        </button>
      </div>

      {/* 4 Metric Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Total Scans</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-stone-900">{totalScans}</div>
          <div className="text-[11px] text-stone-700 mt-1 flex items-center gap-1">
            <span>Derived from verified scan history</span>
          </div>
        </div>

        {/* Healthy Crops */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold">Healthy Plants</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-900">{healthyCount}</div>
          <div className="text-[11px] text-stone-700 mt-1">
            {totalScans > 0 ? `${Math.round((healthyCount / totalScans) * 100)}% of total canopy` : 'Awaiting scans'}
          </div>
        </div>

        {/* Potential Diseases Detected */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold">Diseases Detected</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-950">{diseaseCount}</div>
          <div className="text-[11px] text-stone-700 mt-1">
            {totalScans > 0 ? `${Math.round((diseaseCount / totalScans) * 100)}% require monitoring` : '0 detections'}
          </div>
        </div>

        {/* Critical / Severe Alerts */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-semibold">Severe Invasions</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-rose-950">{severeCount}</div>
          <div className="text-[11px] text-stone-700 mt-1">
            Urgent quarantine actions
          </div>
        </div>
      </div>

      {/* Analytics Row: Health Distribution Chart & Crop Diversity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Canopy Health Distribution
            </h3>
            <span className="text-xs text-stone-700">Calculated across verified scans</span>
          </div>
          <HealthDistributionChart
            healthy={healthyCount}
            low={lowCount}
            moderate={moderateCount}
            severe={severeCount}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Scanned Crop Diversity
            </h3>
            <button 
              onClick={() => onNavigate('library')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold"
            >
              View Catalog
            </button>
          </div>
          <CropDistributionBarChart crops={topCrops} />
        </div>
      </div>

      {/* Recent History Stream & Practical Agronomic Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Analysis History Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Recent Plant Pathological Scans</h3>
              <p className="text-xs text-stone-700">Latest leaf images inspected by AgriSense</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              <span>Full History ({history.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-700 space-y-2">
              <Scan className="w-8 h-8 mx-auto text-stone-500" />
              <p>No leaf scans performed yet.</p>
              <button
                onClick={() => onNavigate('scanner')}
                className="text-emerald-800 font-semibold underline"
              >
                Scan your first plant leaf now
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectResult(item)}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-emerald-200 hover:bg-stone-50/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.is_healthy ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.is_healthy ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 text-xs flex items-center gap-2">
                        <span>{item.disease_name}</span>
                        <span className="text-stone-700 text-[11px] font-normal">· {item.crop_name}</span>
                      </div>
                      <div className="text-[11px] text-stone-700 flex items-center gap-2 mt-0.5">
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{(item.confidence * 100).toFixed(1)}% confidence</span>
                        <span>·</span>
                        <span className="capitalize">{item.severity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-stone-600 group-hover:text-emerald-800">
                    <span className="hidden sm:inline text-[11px]">View Report</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Practical Agronomic Tips */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">Seasonal Agronomic Tips</h3>
            <p className="text-xs text-stone-700">Best practices for foliar disease prevention</p>
          </div>

          <div className="space-y-3.5 text-xs text-stone-700">
            <div className="flex items-start gap-2.5">
              <Droplets className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block mb-0.5">Irrigation Timing</strong>
                <span>Irrigate crops early in the morning so sun evaporates moisture quickly. Spores require &gt;4 hours of continuous leaf wetness to germinate.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Wind className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block mb-0.5">Canopy Ventilation</strong>
                <span>Prune dense lower foliage on tomatoes and eggplants. Enhanced airflow significantly lowers ambient humidity around the leaf surface.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sprout className="w-4 h-4 text-lime-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block mb-0.5">Sanitation & Pruning Tools</strong>
                <span>Disinfect pruners with 70% isopropyl alcohol between rows to prevent transmitting bacterial spot and mosaic viruses across healthy blocks.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={() => onNavigate('assistant')}
                className="w-full py-2 px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200 text-center transition-colors"
              >
                Ask Crop Care Advisor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Crops Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Supported Agricultural Crop Species
            </h3>
            <p className="text-xs text-stone-700">Trained against PlantVillage validated botanical families</p>
          </div>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
          >
            <span>Browse Full Disease Library</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {crops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => onNavigate('scanner')}
              className="p-3 bg-white rounded-xl border border-stone-200 text-center hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group"
            >
              <div className="text-2xl mb-1">{crop.icon}</div>
              <div className="font-bold text-xs text-stone-900 group-hover:text-emerald-900">{crop.name}</div>
              <div className="text-[10px] text-stone-700 mt-0.5">{crop.total_diseases_cataloged} diseases</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
