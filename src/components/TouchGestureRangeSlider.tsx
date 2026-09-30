import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cinematicAudio } from '../lib/cinematicAudio';

interface SliderPreset {
  label: string;
  min?: number;
  max: number;
}

interface TouchGestureRangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  valueMin?: number;
  valueMax: number;
  onChangeMin?: (val: number) => void;
  onChangeMax: (val: number) => void;
  formatValue: (val: number) => string;
  isDual?: boolean;
  presets?: SliderPreset[];
  icon?: React.ReactNode;
  unitLabel?: string;
}

export function TouchGestureRangeSlider({
  label,
  min,
  max,
  step = 1,
  valueMin = min,
  valueMax = max,
  onChangeMin,
  onChangeMax,
  formatValue,
  isDual = false,
  presets = [],
  icon,
  unitLabel
}: TouchGestureRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);

  // Clamp helper
  const clamp = useCallback((val: number, a: number, b: number) => Math.min(Math.max(val, a), b), []);

  // Convert coordinate position to stepped slider value
  const getValueFromX = useCallback((clientX: number): number => {
    if (!trackRef.current) return min;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = clamp((clientX - rect.left) / rect.width, 0, 1);
    const rawVal = min + percent * (max - min);
    const stepped = Math.round(rawVal / step) * step;
    return clamp(stepped, min, max);
  }, [min, max, step, clamp]);

  const handlePointerDown = (e: React.PointerEvent, thumbType: 'min' | 'max') => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setActiveThumb(thumbType);
    cinematicAudio.playTick();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeThumb) return;
    const newVal = getValueFromX(e.clientX);

    if (activeThumb === 'min' && onChangeMin) {
      const constrained = Math.min(newVal, valueMax - step);
      if (constrained !== valueMin) {
        cinematicAudio.playTick();
        onChangeMin(constrained);
      }
    } else if (activeThumb === 'max') {
      const constrained = isDual ? Math.max(newVal, valueMin + step) : newVal;
      if (constrained !== valueMax) {
        cinematicAudio.playTick();
        onChangeMax(constrained);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeThumb) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // pointer capture already released
      }
      setActiveThumb(null);
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickedVal = getValueFromX(e.clientX);
    if (isDual && onChangeMin) {
      const distMin = Math.abs(clickedVal - valueMin);
      const distMax = Math.abs(clickedVal - valueMax);
      if (distMin < distMax) {
        onChangeMin(Math.min(clickedVal, valueMax - step));
      } else {
        onChangeMax(Math.max(clickedVal, valueMin + step));
      }
    } else {
      onChangeMax(clickedVal);
    }
    cinematicAudio.playClick();
  };

  // Percentage calculations
  const minPercent = clamp(((valueMin - min) / (max - min)) * 100, 0, 100);
  const maxPercent = clamp(((valueMax - min) / (max - min)) * 100, 0, 100);

  return (
    <div className="space-y-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-main)] p-4 rounded-2xl shadow-xs text-left selection:bg-none">
      
      {/* Label and Live Header Badge */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-sans font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
          {icon}
          {label}
        </span>

        <span className="font-mono text-xs text-[var(--color-accent-main)] font-bold bg-[var(--color-accent-main)]/10 border border-[var(--color-accent-main)]/30 px-2.5 py-1 rounded-lg">
          {isDual ? `${formatValue(valueMin)} – ${formatValue(valueMax)}` : `${formatValue(valueMax)}`}
          {unitLabel && <span className="ml-1 text-[10px] text-[var(--color-text-muted)]">{unitLabel}</span>}
        </span>
      </div>

      {/* Touch-optimized Track Area */}
      <div className="relative pt-6 pb-2 px-2 touch-none select-none">
        
        {/* Visual Track */}
        <div 
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative h-3 w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-full cursor-pointer overflow-hidden shadow-inner"
        >
          {/* Active Highlight Range */}
          <div 
            className="absolute top-0 bottom-0 bg-gradient-to-r from-[var(--color-accent-main)] to-[#00d2ff] rounded-full transition-all duration-75"
            style={{
              left: `${isDual ? minPercent : 0}%`,
              width: `${isDual ? maxPercent - minPercent : maxPercent}%`
            }}
          />
        </div>

        {/* Min Thumb Handle (Dual Mode) */}
        {isDual && onChangeMin && (
          <div
            onPointerDown={(e) => handlePointerDown(e, 'min')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ left: `${minPercent}%` }}
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center cursor-grab active:cursor-grabbing z-20 transition-transform ${
              activeThumb === 'min' ? 'scale-125 z-30' : 'hover:scale-110'
            }`}
          >
            {/* Active Floating Tooltip Bubble */}
            {activeThumb === 'min' && (
              <div className="absolute -top-9 bg-[#090D14] text-[var(--color-accent-main)] font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-[var(--color-accent-main)] shadow-lg whitespace-nowrap animate-bounce-subtle pointer-events-none">
                {formatValue(valueMin)}
              </div>
            )}
            
            {/* Outer Touch Target Circle (min 44px touch) */}
            <div className={`w-7 h-7 rounded-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-accent-main)] shadow-md flex items-center justify-center ${
              activeThumb === 'min' ? 'ring-4 ring-[var(--color-accent-main)]/30 bg-[var(--color-accent-main)]/20' : ''
            }`}>
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-main)]" />
            </div>
          </div>
        )}

        {/* Max Thumb Handle */}
        <div
          onPointerDown={(e) => handlePointerDown(e, 'max')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ left: `${maxPercent}%` }}
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center cursor-grab active:cursor-grabbing z-20 transition-transform ${
            activeThumb === 'max' ? 'scale-125 z-30' : 'hover:scale-110'
          }`}
        >
          {/* Active Floating Tooltip Bubble */}
          {activeThumb === 'max' && (
            <div className="absolute -top-9 bg-[#090D14] text-[var(--color-accent-main)] font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-[var(--color-accent-main)] shadow-lg whitespace-nowrap animate-bounce-subtle pointer-events-none">
              {formatValue(valueMax)}
            </div>
          )}

          {/* Outer Touch Target Circle (min 44px touch) */}
          <div className={`w-7 h-7 rounded-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-accent-main)] shadow-md flex items-center justify-center ${
            activeThumb === 'max' ? 'ring-4 ring-[var(--color-accent-main)]/30 bg-[var(--color-accent-main)]/20' : ''
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-main)]" />
          </div>
        </div>

      </div>

      {/* Quick Touch Preset Chips */}
      {presets.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none snap-x">
          {presets.map((p, idx) => {
            const isPresetActive = isDual 
              ? (p.min !== undefined ? valueMin === p.min : true) && valueMax === p.max
              : valueMax === p.max;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  cinematicAudio.playClick();
                  if (p.min !== undefined && onChangeMin) {
                    onChangeMin(p.min);
                  }
                  onChangeMax(p.max);
                }}
                className={`snap-start px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 active:scale-95 border ${
                  isPresetActive
                    ? 'bg-[var(--color-accent-main)] text-[#090D14] border-[var(--color-accent-main)] shadow-2xs font-extrabold'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border-[var(--color-border-main)] hover:text-[var(--color-text-header)] hover:border-[var(--color-accent-main)]/40'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
