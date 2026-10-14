import React from 'react';

interface HealthDistributionProps {
  healthy: number;
  low: number;
  moderate: number;
  severe: number;
}

export const HealthDistributionChart: React.FC<HealthDistributionProps> = ({
  healthy,
  low,
  moderate,
  severe,
}) => {
  const total = healthy + low + moderate + severe || 1;
  const pHealthy = Math.round((healthy / total) * 100);
  const pLow = Math.round((low / total) * 100);
  const pMod = Math.round((moderate / total) * 100);
  const pSev = Math.max(0, 100 - (pHealthy + pLow + pMod));

  // Segments for donut chart
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  
  const offsetHealthy = 0;
  const lenHealthy = (pHealthy / 100) * circumference;

  const offsetLow = lenHealthy;
  const lenLow = (pLow / 100) * circumference;

  const offsetMod = lenHealthy + lenLow;
  const lenMod = (pMod / 100) * circumference;

  const offsetSev = lenHealthy + lenLow + lenMod;
  const lenSev = (pSev / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-white rounded-xl border border-stone-200">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-stone-100"
            strokeWidth="16"
            fill="transparent"
          />
          {pHealthy > 0 && (
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#16a34a"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${lenHealthy} ${circumference}`}
              strokeDashoffset={-offsetHealthy}
              className="transition-all duration-700 ease-out"
            />
          )}
          {pLow > 0 && (
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#84cc16"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${lenLow} ${circumference}`}
              strokeDashoffset={-offsetLow}
              className="transition-all duration-700 ease-out"
            />
          )}
          {pMod > 0 && (
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#eab308"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${lenMod} ${circumference}`}
              strokeDashoffset={-offsetMod}
              className="transition-all duration-700 ease-out"
            />
          )}
          {pSev > 0 && (
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#ef4444"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${lenSev} ${circumference}`}
              strokeDashoffset={-offsetSev}
              className="transition-all duration-700 ease-out"
            />
          )}
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-stone-900">{total}</span>
          <span className="text-[11px] text-stone-700 font-medium tracking-tight">Records</span>
        </div>
      </div>

      <div className="flex-1 space-y-2 w-full text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-stone-700 font-medium">Healthy</span>
          </div>
          <span className="font-semibold text-stone-900">{healthy} ({pHealthy}%)</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span>
            <span className="text-stone-700 font-medium">Low Severity</span>
          </div>
          <span className="font-semibold text-stone-900">{low} ({pLow}%)</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-stone-700 font-medium">Moderate</span>
          </div>
          <span className="font-semibold text-stone-900">{moderate} ({pMod}%)</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-stone-700 font-medium">Severe / Critical</span>
          </div>
          <span className="font-semibold text-stone-900">{severe} ({pSev}%)</span>
        </div>
      </div>
    </div>
  );
};

interface CropDistributionBarProps {
  crops: { name: string; count: number; color?: string }[];
}

export const CropDistributionBarChart: React.FC<CropDistributionBarProps> = ({ crops }) => {
  const max = Math.max(...crops.map(c => c.count), 1);

  return (
    <div className="space-y-3 p-4 bg-white rounded-xl border border-stone-200">
      {crops.map((c, i) => {
        const pct = Math.round((c.count / max) * 100);
        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-700">{c.name}</span>
              <span className="text-stone-700">{c.count} scans</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
