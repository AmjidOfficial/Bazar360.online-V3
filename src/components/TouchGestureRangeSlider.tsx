import React from 'react';

export interface TouchGestureRangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (val: number) => void;
  onChangeMax: (val: number) => void;
  isDual?: boolean;
  formatValue?: (val: number) => string;
  presets?: { label: string; min: number; max: number }[];
  icon?: React.ReactNode;
  className?: string;
}

export function TouchGestureRangeSlider({
  label,
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  isDual = true,
  formatValue = (v) => `${v}`,
  presets,
  icon,
  className = '',
}: TouchGestureRangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val <= valueMax) {
      onChangeMin(val);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val >= valueMin) {
      onChangeMax(val);
    }
  };

  // Percentage calculations for track highlight
  const minPercent = Math.max(0, Math.min(100, ((valueMin - min) / (max - min)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((valueMax - min) / (max - min)) * 100));

  return (
    <div className={`space-y-3 p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800/80 ${className}`}>
      {/* Header with Label and Current Range */}
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
          {icon}
          {label}
        </span>
        <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 text-[11px]">
          {isDual ? `${formatValue(valueMin)} – ${formatValue(valueMax)}` : formatValue(valueMax)}
        </span>
      </div>

      {/* Dual Sliders Track */}
      <div className="relative py-2 touch-none">
        {/* Background track */}
        <div className="h-2 w-full bg-slate-800 rounded-full relative overflow-hidden">
          {/* Active colored segment */}
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
        </div>

        {/* Inputs overlay */}
        <div className="relative">
          {isDual && (
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={valueMin}
              onChange={handleMinChange}
              aria-label={`${label} minimum`}
              className="absolute -top-3 left-0 w-full h-4 appearance-none bg-transparent pointer-events-auto cursor-pointer accent-sky-400 z-20"
            />
          )}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={valueMax}
            onChange={handleMaxChange}
            aria-label={`${label} maximum`}
            className="absolute -top-3 left-0 w-full h-4 appearance-none bg-transparent pointer-events-auto cursor-pointer accent-sky-400 z-20"
          />
        </div>
      </div>

      {/* Preset quick buttons if available */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presets.map((preset, idx) => {
            const isActive = valueMin === preset.min && valueMax === preset.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChangeMin(preset.min);
                  onChangeMax(preset.max);
                }}
                className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-xs'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TouchGestureRangeSlider;
