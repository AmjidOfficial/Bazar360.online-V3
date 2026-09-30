import React from 'react';
import { Car, Store, SlidersHorizontal, Sparkles } from 'lucide-react';

export const VehicleCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col animate-pulse">
    <div className="aspect-[16/10] bg-slate-200 relative">
      <div className="absolute top-3 left-3 w-16 h-5 bg-slate-300 rounded" />
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-300" />
    </div>
    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-5 bg-slate-300 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <div className="h-6 bg-slate-100 rounded" />
          <div className="h-6 bg-slate-100 rounded" />
          <div className="h-6 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-8 bg-slate-900/20 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

export const HomeFeedSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse pb-16">
    {/* Category Bar Skeleton */}
    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
      <div className="h-3 bg-slate-200 rounded w-36" />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>

    {/* Hero Banner Skeleton */}
    <div className="bg-[#0B1326] rounded-3xl p-6 sm:p-8 space-y-4">
      <div className="w-28 h-6 bg-slate-800 rounded" />
      <div className="h-8 bg-slate-700 rounded w-2/3" />
      <div className="h-4 bg-slate-800 rounded w-1/2" />
      <div className="h-16 bg-slate-900 rounded-xl" />
    </div>

    {/* Accordion Showcase Skeleton */}
    <div className="h-[420px] bg-slate-900 rounded-3xl p-6 border border-slate-800 flex gap-3">
      <div className="flex-[3] bg-slate-800 rounded-2xl" />
      <div className="flex-1 bg-slate-850 rounded-2xl hidden md:block" />
      <div className="flex-1 bg-slate-850 rounded-2xl hidden md:block" />
    </div>

    {/* Grid Skeleton */}
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200 rounded w-48" />
        <div className="h-4 bg-slate-200 rounded w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const AutoChoiceSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse pb-16">
    {/* Top Bar Skeleton */}
    <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded w-56" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-slate-100 rounded-xl" />
          <div className="h-8 w-24 bg-slate-100 rounded-xl" />
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>

    {/* Grid Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:block bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="h-9 bg-slate-100 rounded-xl" />
        <div className="h-9 bg-slate-100 rounded-xl" />
        <div className="h-9 bg-slate-100 rounded-xl" />
        <div className="h-9 bg-slate-100 rounded-xl" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="lg:col-span-3 space-y-4">
        <div className="h-10 bg-white rounded-2xl border border-slate-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
