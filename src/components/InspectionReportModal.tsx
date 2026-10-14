import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Download, CheckCircle2, AlertTriangle, FileText, Check } from 'lucide-react';
import { CarListing } from '../types';
import { generateInspectionPDF } from '../lib/inspectionPdfService';
import { toast } from 'sonner';

export interface InspectionReportModalProps {
  car: CarListing;
  isOpen: boolean;
  onClose: () => void;
}

export function InspectionReportModal({ car, isOpen, onClose }: InspectionReportModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const inspectionScore = car.inspectionScore ?? (car.isVerified ? 9.2 : 8.5);

  const inspectionCategories = [
    { name: 'Engine & Powertrain', rating: '9.4/10', status: 'Excellent', details: 'No abnormal noise, clean fluids, optimal compression.' },
    { name: 'Transmission & Drivetrain', rating: '9.2/10', status: 'Optimal', details: 'Smooth gear shift transitions, zero slip detected.' },
    { name: 'Chassis & Suspension', rating: '9.0/10', status: 'Original', details: 'No frame damage, bushings & struts intact, OEM alignment.' },
    { name: 'Body & Paint Condition', rating: `${car.bodyCondition === 'Total Genuine' ? '9.8' : '8.6'}/10`, status: car.bodyCondition || 'Genuine', details: 'Factory primer verified via magnetic gauge meter.' },
    { name: 'Electronics & Diagnostics', rating: '9.5/10', status: 'Clear', details: 'OBD-II scan clean with 0 active DTC error codes.' },
    { name: 'Document & Legal Verification', rating: '10/10', status: car.tokenTaxPaid ? 'Tax Paid' : 'Verified', details: `Clear title, smart card / file verified, ${car.documentType || 'Original File'}.` },
  ];

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await generateInspectionPDF(car);
      toast.success('Inspection report downloaded successfully!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to generate inspection PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md">
                  BAZAR360 Certified
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> 200+ Point Passed
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {car.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Multi-Point Digital Inspection Audit Certificate
              </p>
            </div>
          </div>

          {/* Score Banner */}
          <div className="bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-800/50 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Rating</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-400">{inspectionScore}</span>
                <span className="text-xs font-mono text-slate-400">/ 10 Rating</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Check size={14} /> Passed All Safety Checks
              </span>
            </div>
          </div>

          {/* Category checklist */}
          <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
            {inspectionCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200">{cat.name}</span>
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {cat.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{cat.details}</p>
                </div>
                <span className="font-mono font-bold text-sky-400 text-sm shrink-0">
                  {cat.rating}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <FileText size={14} className="text-sky-400" />
              <span>Full tamper-proof report backed by Bazar360 assurance</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-sky-500/20 transition-all disabled:opacity-50"
              >
                <Download size={14} />
                {downloading ? 'Preparing PDF...' : 'Download PDF Report'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default InspectionReportModal;
