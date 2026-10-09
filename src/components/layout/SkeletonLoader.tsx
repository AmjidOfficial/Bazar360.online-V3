import React from 'react';
import { VehicleSkeletonCard } from '../VehicleSkeletonCard';

export const SkeletonLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-white font-black text-xs">360</span>
          </div>
        </div>
        <p className="text-orange-500 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Bazar360...</p>
      </div>
    </div>
  );
};

export const RecentActivitySkeleton = () => {
  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-3xl border border-[var(--color-border-main)] p-6 space-y-4 shadow-sm animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-orange-500/30 rounded-full shrink-0" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
      </div>

      {/* Activity Items Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-start gap-3 p-2.5 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border-main)]">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
            <div className="flex-grow space-y-1.5 min-w-0">
              <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShowroomInventorySkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <VehicleSkeletonCard key={idx} />
      ))}
    </div>
  );
};

