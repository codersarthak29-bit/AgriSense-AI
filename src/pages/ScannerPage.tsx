import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Scan, 
  Image as ImageIcon, 
  X, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileCheck, 
  Cpu, 
  Info,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AnalysisResult, CropCatalogItem, AnalysisMode } from '../types';
import { api } from '../services/api';
import { DiagnosticCard } from '../components/DiagnosticCard';
import { SAMPLE_LEAVES, SampleLeaf } from '../utils/sampleImages';

interface ScannerPageProps {
  crops: CropCatalogItem[];
  onAnalysisComplete: (result: AnalysisResult) => void;
  geminiAvailable?: boolean;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  crops,
  onAnalysisComplete,
  geminiAvailable = false
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('Auto-detect');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('mobilenet_v2_classifier');
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, JPEG, PNG, WebP).');
      return;
    }

    const maxSizeMb = 15;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image size exceeds ${maxSizeMb}MB. Please select a smaller photo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
        setFileName(file.name);
        setFileSize((file.size / 1024).toFixed(1) + ' KB');
        setCurrentResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSelectSample = (sample: SampleLeaf) => {
    setSelectedImage(sample.dataUri);
    setFileName(sample.fileName);
    setFileSize('18.4 KB (Sample Asset)');
    setSelectedCrop(sample.crop);
    setError(null);
    setCurrentResult(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setFileName('');
    setFileSize('');
    setCurrentResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please upload or select a plant leaf image to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentResult(null);

    // Multi-stage progress feedback
    try {
      setAnalysisStep('Normalizing image resolution to 224x224 RGB...');
      await new Promise(r => setTimeout(r, 450));

      setAnalysisStep('Evaluating leaf lamina geometry & lesion contrast...');
      await new Promise(r => setTimeout(r, 550));

      setAnalysisStep('Computing probability distribution across 38 PlantVillage classes...');
      const result = await api.predict(selectedImage, selectedCrop, analysisMode, fileName);

      setAnalysisStep('Generating Integrated Pest Management care protocol...');
      await new Promise(r => setTimeout(r, 350));

      setCurrentResult(result);
      onAnalysisComplete(result);
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err.message || 'Failed to complete analysis. Please try a clearer leaf photo.');
    } finally {
      setLoading(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
          AI Crop Disease Scanner
        </h1>
        <p className="text-xs md:text-sm text-stone-600 mt-1">
          Upload a high-resolution leaf photograph or choose a sample to identify foliar pathogens and get safe care protocols.
        </p>
      </div>

      {/* Main Analysis Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Uploader & Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                1. Plant Leaf Photo
              </span>
              {selectedImage && (
                <button
                  onClick={handleClearImage}
                  disabled={loading}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedImage ? (
              /* Dropzone */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragOver 
                    ? 'border-emerald-600 bg-emerald-50/60' 
                    : 'border-stone-300 hover:border-emerald-500 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-sm text-stone-900">
                    Click to upload leaf photo or drag & drop here
                  </div>
                  <div className="text-xs text-stone-700 mt-1">
                    Accepts JPG, JPEG, PNG, or WebP (up to 15MB)
                  </div>
                </div>
                <div className="text-[11px] text-stone-700 max-w-xs leading-relaxed">
                  Tip: Capture a close-up photo showing distinct leaf lesions against natural ambient lighting.
                </div>
              </div>
            ) : (
              /* Image Preview */
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-950 flex items-center justify-center max-h-80 group">
                  <img
                    src={selectedImage}
                    alt="Uploaded leaf preview"
                    className="max-h-80 w-auto object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="px-3.5 py-2 bg-white text-stone-900 rounded-lg text-xs font-semibold shadow hover:bg-stone-100"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={handleClearImage}
                      disabled={loading}
                      className="px-3.5 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span className="truncate max-w-xs">{fileName}</span>
                  <span>{fileSize}</span>
                </div>
              </div>
            )}

            {/* Pre-crafted Sample Leaf Tray */}
            <div className="pt-4 border-t border-stone-100 space-y-2.5">
              <div className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                <span>Or test immediately with a calibrated sample leaf:</span>
                <span className="text-[11px] text-emerald-800 font-medium">1-Click Demo</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_LEAVES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    disabled={loading}
                    className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/70 hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="w-full h-14 bg-stone-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center border border-stone-200/60">
                      <img src={sample.dataUri} alt={sample.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-semibold text-[11px] text-stone-900 truncate group-hover:text-emerald-900">
                      {sample.name}
                    </div>
                    <div className="text-[10px] text-stone-700 truncate">
                      {sample.expectedDisease}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
              2. Crop Type & Model Configuration
            </span>

            {/* Crop Selector */}
            <div className="space-y-1.5">
              <label htmlFor="crop-select" className="text-xs font-semibold text-stone-700 block">
                Target Crop Species
              </label>
              <select
                id="crop-select"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              >
                <option value="Auto-detect">Auto-detect if supported (Recommended)</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.icon} {c.name} ({c.scientific_name})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-700">
                Constrains differential candidate diagnosis to the selected botanical family.
              </p>
            </div>

            {/* Analysis Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Inference Engine Mode
              </label>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setAnalysisMode('mobilenet_v2_classifier')}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    analysisMode === 'mobilenet_v2_classifier'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-emerald-700" />
                      MobileNetV2 Classifier (Calibrated)
                    </span>
                    {analysisMode === 'mobilenet_v2_classifier' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    Transfer learning CNN with calibrated softmax probabilities across 38 PlantVillage disease classes.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalysisMode('gemini_vision_assisted')}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    analysisMode === 'gemini_vision_assisted'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-lime-700" />
                      Gemini 3.8 Flash Vision (AI-Assisted)
                    </span>
                    {analysisMode === 'gemini_vision_assisted' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    Exploratory multimodal visual assessment for ambiguous farm conditions or unlisted crops. Labeled AI-assisted.
                  </p>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedImage}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                loading || !selectedImage
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/10'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-lime-400" />
                  <span>Processing Diagnostic Pipeline...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 text-lime-400" />
                  <span>Analyze Plant</span>
                </>
              )}
            </button>

            {/* Loading Step Progress Animation */}
            {loading && (
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-600">
                  <span className="font-semibold text-emerald-900">Analyzing Foliar Features</span>
                  <span className="animate-pulse text-emerald-700">In Progress</span>
                </div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]" />
                </div>
                <div className="text-[11px] text-stone-700 italic">
                  {analysisStep || 'Initiating neural inference...'}
                </div>
              </div>
            )}

            {/* Transparency Note */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-700 leading-relaxed">
              <strong>Pathology Safeguard: </strong>
              AgriSense AI provides decision support. Inconclusive or low-confidence readings will request a clearer leaf angle and suggest local agronomist inspection.
            </div>
          </div>
        </div>
      </div>

      {/* Results View */}
      {currentResult && (
        <section className="pt-4 space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Diagnostic Assessment Results
            </h2>
            <span className="text-xs text-stone-700">Scan ID: {currentResult.id}</span>
          </div>

          <DiagnosticCard result={currentResult} />
        </section>
      )}
    </div>
  );
};
