import React from 'react';
import { 
  Scan, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Sprout, 
  Globe2, 
  CheckCircle2, 
  Activity, 
  BookOpen, 
  Layers,
  ChevronRight,
  TrendingDown,
  Shield
} from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';

interface LandingPageProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectSampleScan?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-900 to-emerald-950 text-white p-8 md:p-14 shadow-sm">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 Q50,100 100,0 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-xs text-lime-300 font-medium">
            <Sprout className="w-3.5 h-3.5 text-lime-400" />
            <span>AgriSense AI · Intelligent Plant Pathology</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Detect Crop Diseases <span className="text-lime-400">Before They Spread.</span>
          </h1>

          <p className="text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
            Empowering farmers, agricultural extension workers, and researchers with real-time foliar disease classification, calibrated confidence metrics, and organic IPM care protocols.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-lime-500 hover:bg-lime-400 text-emerald-950 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95"
            >
              <Scan className="w-4 h-4 text-emerald-950" />
              <span>Analyze a Crop</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-800/90 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl border border-emerald-700/80 transition-colors"
            >
              <span>Explore Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('library')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-transparent hover:bg-white/10 text-emerald-100 font-medium text-sm rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <span>Disease Reference Library</span>
            </button>
          </div>

          {/* Quick stats ribbon */}
          <div className="pt-8 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-2xl font-bold text-white">38</div>
              <div className="text-emerald-200/80 mt-0.5">PlantVillage Classes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">14+</div>
              <div className="text-emerald-200/80 mt-0.5">Crop Species</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-lime-400">MobileNetV2</div>
              <div className="text-emerald-200/80 mt-0.5">Lightweight CNN</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-emerald-200/80 mt-0.5">IPM & Non-Toxic Focus</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Features */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Intelligent Pathology Suite
          </h2>
          <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            Scientific Agronomy at Your Fingertips
          </h3>
          <p className="text-sm text-stone-600">
            Engineered with deep learning transfer architectures, biological disease profiles, and actionable agronomic advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Scan className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-stone-900 mb-2">
              Disease Detection & Grading
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Real-time classification identifying foliar infections across tomato, potato, corn, apple, grape, and more. Features calibrated confidence probabilities and secondary candidate evaluations.
            </p>
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
            >
              <span>Launch Scanner</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-lime-50 text-lime-800 flex items-center justify-center mb-4 group-hover:bg-lime-700 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-stone-900 mb-2">
              Smart IPM Recommendations
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Actionable remedial advice emphasizing Integrated Pest Management (IPM), biological bio-fungicides (such as Bacillus subtilis), and cultural airflow techniques without hazardous chemical overdosing.
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
            >
              <span>Explore Protocols</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-4 group-hover:bg-stone-800 group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-stone-900 mb-2">
              Crop Health History & Trends
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Track multi-field health progressions, download diagnostic summaries, and inspect seasonal outbreaks over time to identify micro-climate disease reservoirs before economic thresholds are breached.
            </p>
            <button
              onClick={() => onNavigate('history')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
            >
              <span>View History Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* How it Works - 3 Steps */}
      <section className="bg-stone-100/70 rounded-3xl p-8 md:p-12 border border-stone-200">
        <div className="max-w-2xl mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Simple 3-Step Workflow
          </h3>
          <h4 className="text-2xl font-bold text-stone-900 tracking-tight">
            How AgriSense AI Diagnoses Your Crops
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h5 className="font-bold text-stone-900 text-sm">Upload or Capture Leaf</h5>
            <p className="text-xs text-stone-600 leading-relaxed">
              Take a clear snapshot of an affected or healthy leaf using your mobile camera or upload an existing photo (JPG, PNG, WebP).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h5 className="font-bold text-stone-900 text-sm">Deep Feature Analysis</h5>
            <p className="text-xs text-stone-600 leading-relaxed">
              MobileNetV2 neural feature extractors examine lesion shape, concentric halos, and chlorosis patterns against 38 calibrated classes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h5 className="font-bold text-stone-900 text-sm">Targeted Intervention</h5>
            <p className="text-xs text-stone-600 leading-relaxed">
              Receive structured immediate actions, organic treatment protocols, and specific extension officer warning triggers.
            </p>
          </div>
        </div>
      </section>

      {/* UN Sustainable Development Goals Alignment */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Globe2 className="w-4 h-4 text-emerald-700" />
            <span>United Nations Sustainable Development Goals</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            Designed for Measurable Agricultural Impact
          </h3>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            AgriSense AI was architected from inception to directly advance three key UN Sustainable Development Goals through responsible AI/ML technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SDG 2 */}
          <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-emerald-900">SDG 2</span>
              <span className="text-[11px] font-bold text-emerald-800 uppercase px-2 py-0.5 bg-emerald-100 rounded">Zero Hunger</span>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Protecting Global Food Supply</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Foliar crop diseases reduce smallholder yields by up to 40% annually. Early detection prevents regional blight contagion, safeguarding food supply for vulnerable communities.
            </p>
          </div>

          {/* SDG 12 */}
          <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-lime-900">SDG 12</span>
              <span className="text-[11px] font-bold text-lime-800 uppercase px-2 py-0.5 bg-lime-100 rounded">Responsible Consumption</span>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Stopping Reckless Chemical Overuse</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Eliminates blanket prophylactic chemical spraying. Replaces arbitrary toxic treatments with verified condition-specific biological controls and integrated pest management.
            </p>
          </div>

          {/* SDG 15 */}
          <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-emerald-900">SDG 15</span>
              <span className="text-[11px] font-bold text-emerald-800 uppercase px-2 py-0.5 bg-emerald-100 rounded">Life on Land</span>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Preserving Soil Microbiomes</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Excessive synthetic copper and chemical fungicides accumulate in agricultural soil, destroying mycorrhizal fungi and earthworms. AgriSense AI fosters soil ecosystem longevity.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-stone-200 text-xs text-stone-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span className="font-bold text-stone-800">AgriSense AI — Smart Crop Doctor</span>
          <span>·</span>
          <span>Internship ML Project Showcase</span>
        </div>
        <div className="flex items-center gap-4 text-stone-700">
          <button onClick={() => onNavigate('settings')} className="hover:text-stone-900">
            ML Training Code
          </button>
          <span>·</span>
          <button onClick={() => onNavigate('library')} className="hover:text-stone-900">
            Disease Catalog
          </button>
          <span>·</span>
          <button onClick={() => onNavigate('impact')} className="hover:text-stone-900">
            Impact Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};
