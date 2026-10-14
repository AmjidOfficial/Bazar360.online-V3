import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, ZoomIn, ZoomOut, Compass, Sparkles, Smartphone, Eye } from 'lucide-react';
import { CarListing } from '../types';

export interface VehicleARInspectorModalProps {
  car: CarListing;
  onClose: () => void;
}

export function VehicleARInspectorModal({ car, onClose }: VehicleARInspectorModalProps) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mode, setMode] = useState<'360' | 'wireframe' | 'xray'>('360');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const images = [car.imageUrl, ...(car.images || [])].filter(Boolean);
  const activeImage = images[0] || '/auto_choice_official_logo.jpg';

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    setRotationAngle((prev) => (prev + delta * 0.4) % 360);
    setDragStartX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col text-slate-100 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 flex items-center gap-1">
                  <Sparkles size={11} /> 360° AR Inspector
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {car.year} • {car.make} {car.model}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {car.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Interactive 3D / 360 Canvas Display */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative flex-1 min-h-[320px] sm:min-h-[420px] bg-radial from-slate-800/80 to-slate-950 rounded-2xl border border-slate-800/90 my-4 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
          >
            {/* Grid overlay for 3D feeling */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Rotatable Vehicle Visualizer */}
            <div
              className="relative transition-transform duration-75 flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotationAngle * 0.05}deg)`,
                filter: mode === 'wireframe' ? 'invert(1) hue-rotate(180deg) contrast(1.5)' : mode === 'xray' ? 'hue-rotate(90deg) contrast(1.8)' : 'none',
              }}
            >
              <img
                src={activeImage}
                alt={car.title}
                className="max-h-[300px] sm:max-h-[380px] w-auto object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] pointer-events-none"
              />
            </div>

            {/* Floating Rotation Compass */}
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono text-sky-400">
              <Compass size={14} className="animate-spin text-sky-400" />
              <span>Rotation: {Math.round(rotationAngle)}°</span>
            </div>

            {/* Helper drag instruction */}
            <div className="absolute top-4 bg-slate-900/70 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-300">
              Drag horizontally to inspect • Scroll / Zoom
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs font-mono px-1 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setRotationAngle(0);
                  setZoomLevel(1);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-all cursor-pointer ml-1 border-l border-slate-800 pl-2"
                title="Reset View"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Footer Controls & Modes */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">View Mode:</span>
              <button
                type="button"
                onClick={() => setMode('360')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  mode === '360'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Photorealistic
              </button>
              <button
                type="button"
                onClick={() => setMode('wireframe')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  mode === 'wireframe'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Contrast Highlighting
              </button>
              <button
                type="button"
                onClick={() => setMode('xray')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  mode === 'xray'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Chassis Scanner
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer transition-all"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default VehicleARInspectorModal;
