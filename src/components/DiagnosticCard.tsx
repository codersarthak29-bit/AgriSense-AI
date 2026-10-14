import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Leaf, 
  Copy, 
  Check, 
  Share2, 
  Printer, 
  Activity, 
  Eye, 
  Sprout, 
  Clock, 
  BookOpen, 
  AlertOctagon,
  ExternalLink
} from 'lucide-react';

interface DiagnosticCardProps {
  result: AnalysisResult;
  onOpenLibraryItem?: (crop: string, disease: string) => void;
  showImageThumbnail?: boolean;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({
  result,
  onOpenLibraryItem,
  showImageThumbnail = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `AgriSense AI Diagnostic Report
Crop: ${result.crop_name}
Condition: ${result.disease_name} (${result.is_healthy ? 'Healthy' : result.severity})
Confidence: ${(result.confidence * 100).toFixed(1)}% (${result.confidence_calibrated ? 'Calibrated Classifier' : 'AI-Assisted Assessment'})
Date: ${new Date(result.timestamp).toLocaleDateString()}

Observations:
${result.observations.map(o => `• ${o}`).join('\n')}

Immediate Actions:
${result.recommended_actions.map(a => `• ${a}`).join('\n')}

Safe Cultural Management:
${result.safe_crop_management.map(m => `• ${m}`).join('\n')}

When to Seek Expert:
${result.expert_consultation_triggers.map(t => `• ${t}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-stone-800">
      {/* Header Banner */}
      <div className={`p-6 border-b ${
        result.is_healthy 
          ? 'bg-emerald-50/70 border-emerald-100' 
          : result.severity === 'Severe' || result.severity === 'Critical'
            ? 'bg-rose-50/70 border-rose-100'
            : 'bg-amber-50/70 border-amber-100'
      }`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-xl ${
              result.is_healthy 
                ? 'bg-emerald-600 text-white' 
                : result.severity === 'Severe' || result.severity === 'Critical'
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-600 text-white'
            }`}>
              {result.is_healthy ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : result.severity === 'Severe' || result.severity === 'Critical' ? (
                <ShieldAlert className="w-7 h-7" />
              ) : (
                <AlertTriangle className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-stone-700 mb-1">
                <span className="font-semibold uppercase tracking-wider text-stone-700">{result.crop_name}</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(result.timestamp).toLocaleDateString()}</span>
                <span aria-hidden="true">·</span>
                <span>{result.analysis_mode === 'mobilenet_v2_classifier' ? 'MobileNetV2 Classifier' : 'Gemini 3.8 Flash Vision'}</span>
              </div>

              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                {result.disease_name}
              </h2>

              <p className="mt-1 text-sm text-stone-600 max-w-2xl leading-relaxed">
                {result.diagnosis_summary}
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-2xs"
              title="Copy structured summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-2xs"
              title="Print diagnostic card"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>

        {/* Unboxed Confidence & Severity Metadata */}
        <div className="mt-5 pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span className="text-stone-700">Model Confidence:</span>
            <span className="font-bold text-stone-900">{(result.confidence * 100).toFixed(1)}%</span>
            <span className="text-[11px] text-stone-700">
              ({result.confidence_calibrated ? 'Calibrated Softmax Probability' : 'AI-Assisted Assessment'})
            </span>
          </div>

          <span aria-hidden="true" className="text-stone-300">|</span>

          <div className="flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-amber-700" />
            <span className="text-stone-700">Severity Assessment:</span>
            <span className={`font-semibold ${
              result.is_healthy ? 'text-emerald-700' : 'text-stone-900'
            }`}>
              {result.severity}
            </span>
          </div>

          {result.imageFileName && (
            <>
              <span aria-hidden="true" className="text-stone-300">|</span>
              <span className="text-stone-700 truncate max-w-xs">File: {result.imageFileName}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Diagnostic Body */}
      <div className="p-6 space-y-6">
        {/* Visual Observations vs Diagnosis Distinction */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 mb-2 text-stone-900 font-semibold text-sm">
            <Eye className="w-4 h-4 text-emerald-800" />
            <span>Observed Visual Symptoms</span>
            <span className="text-[11px] font-normal text-stone-700">(Distinguishing physical leaf evidence from clinical diagnosis)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-stone-700 pl-5 list-disc">
            {result.observations.map((obs, idx) => (
              <li key={idx} className="leading-relaxed">{obs}</li>
            ))}
          </ul>
        </div>

        {/* Alternative Candidate Predictions */}
        {result.alternative_predictions && result.alternative_predictions.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              Differential Diagnosis & Alternative Candidates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.alternative_predictions.map((alt, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-stone-200 text-xs">
                  <div>
                    <span className="font-medium text-stone-800">{alt.disease_name}</span>
                    <span className="text-stone-700 ml-1.5 text-[11px]">({alt.crop_name})</span>
                  </div>
                  <span className="font-semibold text-stone-700">{(alt.confidence * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Protocols Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Immediate Interventions */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Recommended Immediate Actions</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700">
              {result.recommended_actions.map((act, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safe Cultural & Organic IPM Practices */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-sm">
              <Sprout className="w-4 h-4 text-lime-700" />
              <span>Safe Management & Organic IPM</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700">
              {result.safe_crop_management.map((mgmt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-700 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{mgmt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preventive Measures */}
        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-stone-700" />
            <span>Long-term Agronomic & Cultural Prevention</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
            {result.preventive_measures.map((prev, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{prev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Extension Officer Consultation Triggers */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
          <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>When to Consult Local Agricultural Extension / Lab Testing</span>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-900/90 pl-5 list-disc">
            {result.expert_consultation_triggers.map((trigger, idx) => (
              <li key={idx} className="leading-relaxed">{trigger}</li>
            ))}
          </ul>
        </div>

        {/* SDG Contribution Note & Legal Disclaimer */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="italic">{result.sdg_impact_note}</span>
          </div>
        </div>

        <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-700 border border-stone-200 leading-relaxed">
          <strong className="text-stone-800">Agricultural Diagnostic Disclaimer: </strong>
          {result.disclaimer}
        </div>
      </div>
    </div>
  );
};
