import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  ShieldCheck, 
  Sprout, 
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { DiseaseInfo, CropCatalogItem } from '../types';
import { api } from '../services/api';

interface DiseaseLibraryPageProps {
  crops: CropCatalogItem[];
  onScanWithCrop?: (cropName: string) => void;
}

export const DiseaseLibraryPage: React.FC<DiseaseLibraryPageProps> = ({
  crops,
  onScanWithCrop
}) => {
  const [diseases, setDiseases] = useState<DiseaseInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeModalDisease, setActiveModalDisease] = useState<DiseaseInfo | null>(null);

  useEffect(() => {
    loadDiseases();
  }, [searchQuery, selectedCrop, selectedCategory]);

  const loadDiseases = async () => {
    setLoading(true);
    try {
      const data = await api.getDiseases(searchQuery, selectedCrop, selectedCategory);
      setDiseases(data);
    } catch (err) {
      console.error('Failed to load diseases:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Fungal', 'Bacterial', 'Viral', 'Healthy'];

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
          Disease Reference Library
        </h1>
        <p className="text-xs md:text-sm text-stone-600 mt-1">
          Peer-reviewed agricultural pathology repository detailing symptoms, infection biology, and non-toxic IPM treatments.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by pathogen, disease name, or symptom keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Crop Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            >
              <option value="all">All Crops</option>
              {crops.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              <option value="Fungal">Fungal Pathogens</option>
              <option value="Bacterial">Bacterial Pathogens</option>
              <option value="Viral">Viral Pathogens</option>
              <option value="Healthy">Healthy Baselines</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Segmented Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 overflow-x-auto text-xs">
          <span className="text-stone-700 text-[11px] font-semibold shrink-0">Pathogen Class:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Classes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-stone-700">
          Loading reference entries...
        </div>
      ) : diseases.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-700 text-xs space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-stone-400" />
          <p className="font-semibold text-stone-800">No matching diseases found.</p>
          <p>Try modifying your search term or clearing the crop filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Crop & Category Info (Zero-pill text format) */}
                <div className="flex items-center justify-between text-xs text-stone-700">
                  <span className="font-semibold text-emerald-900 uppercase tracking-wide">{d.crop}</span>
                  <div className="flex items-center gap-1.5">
                    <span>{d.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className={d.severity_level === 'Severe' ? 'text-rose-600 font-semibold' : 'text-stone-600'}>
                      {d.severity_level} Severity
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {d.disease_name}
                  </h3>
                  {d.scientific_name && (
                    <div className="text-[11px] text-stone-700 italic mt-0.5">
                      {d.scientific_name}
                    </div>
                  )}
                </div>

                {/* Primary Symptoms */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                    Key Visual Markers:
                  </span>
                  <ul className="text-xs text-stone-600 space-y-1 pl-4 list-disc">
                    {d.symptoms.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="line-clamp-2">{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Favorable Environmental Conditions */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-stone-800">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                    <span>Temp: {d.favorable_conditions.temperature}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-stone-800">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span>Humidity: {d.favorable_conditions.humidity}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalDisease(d)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                >
                  <span>Full Pathology Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {onScanWithCrop && (
                  <button
                    onClick={() => onScanWithCrop(d.crop)}
                    className="text-[11px] font-medium text-stone-600 hover:text-stone-900"
                  >
                    Scan {d.crop}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disease Detail Modal */}
      {activeModalDisease && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-stone-700 mb-1">
                  <span>{activeModalDisease.crop}</span>
                  <span className="mx-2">·</span>
                  <span>{activeModalDisease.category} Pathology</span>
                  <span className="mx-2">·</span>
                  <span className="font-semibold text-stone-900">{activeModalDisease.severity_level} Severity</span>
                </div>
                <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  {activeModalDisease.disease_name}
                </h2>
                {activeModalDisease.scientific_name && (
                  <div className="text-xs text-stone-700 italic mt-0.5">
                    {activeModalDisease.scientific_name}
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveModalDisease(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detailed Symptoms */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Detailed Diagnostic Symptoms
              </h3>
              <ul className="text-xs text-stone-700 space-y-1.5 pl-5 list-disc">
                {activeModalDisease.symptoms.map((sym, idx) => (
                  <li key={idx} className="leading-relaxed">{sym}</li>
                ))}
              </ul>
            </div>

            {/* Favorable Environmental Conditions & Transmission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
              <div>
                <strong className="text-stone-900 block mb-1">Favorable Microclimate:</strong>
                <p className="text-stone-600">Temp: {activeModalDisease.favorable_conditions.temperature}</p>
                <p className="text-stone-600">Humidity: {activeModalDisease.favorable_conditions.humidity}</p>
                <p className="text-stone-600 mt-1">{activeModalDisease.favorable_conditions.weather}</p>
              </div>
              <div>
                <strong className="text-stone-900 block mb-1">Mode of Transmission:</strong>
                <p className="text-stone-600 leading-relaxed">{activeModalDisease.transmission_mode}</p>
              </div>
            </div>

            {/* Prevention Measures */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Preventive Cultural Hygiene
              </h3>
              <ul className="text-xs text-stone-700 space-y-1.5 pl-5 list-disc">
                {activeModalDisease.prevention_measures.map((pm, idx) => (
                  <li key={idx} className="leading-relaxed">{pm}</li>
                ))}
              </ul>
            </div>

            {/* Safe Organic & IPM Controls */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Safe Organic & Biological Interventions
              </h3>
              <ul className="text-xs text-stone-700 space-y-1.5 pl-5 list-disc">
                {activeModalDisease.organic_management.map((om, idx) => (
                  <li key={idx} className="leading-relaxed">{om}</li>
                ))}
              </ul>
            </div>

            {/* Extension Officer Warning */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Agricultural Extension Protocol:
              </strong>
              <p className="leading-relaxed">{activeModalDisease.when_to_seek_expert}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalDisease(null)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
