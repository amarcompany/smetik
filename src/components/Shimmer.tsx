import React from 'react';

export const ShimmerBanner: React.FC = () => {
  return (
    <div id="shimmer-banner" className="w-full h-44 rounded-[24px] animate-shimmer bg-gray-100" />
  );
};

export const ShimmerCard: React.FC = () => {
  return (
    <div id="shimmer-card" className="bg-white border border-gray-50 rounded-3xl p-3 flex flex-col gap-2.5 shadow-soft w-full">
      <div className="w-full aspect-[4/5] rounded-2xl animate-shimmer bg-gray-100" />
      <div className="h-3.5 w-1/3 rounded animate-shimmer bg-gray-100" />
      <div className="h-4.5 w-4/5 rounded animate-shimmer bg-gray-100" />
      <div className="flex justify-between items-center mt-1">
        <div className="h-4.5 w-1/2 rounded animate-shimmer bg-gray-100" />
        <div className="w-7 h-7 rounded-xl animate-shimmer bg-gray-100" />
      </div>
    </div>
  );
};

export const ShimmerSectionHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="h-4 w-1/2 rounded animate-shimmer bg-gray-100" />
      <div className="h-3.5 w-12 rounded animate-shimmer bg-gray-100" />
    </div>
  );
};

export const ShimmerProductRow: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <ShimmerSectionHeader />
      <div className="flex gap-3 overflow-hidden">
        <div className="w-36 flex-shrink-0">
          <ShimmerCard />
        </div>
        <div className="w-36 flex-shrink-0">
          <ShimmerCard />
        </div>
      </div>
    </div>
  );
};

export const ShimmerCategoriesPage: React.FC = () => {
  return (
    <div className="flex h-full w-full bg-white divide-x divide-gray-100 animate-fade-in">
      {/* Compact left filtering sidebar skeleton */}
      <div className="w-24 md:w-32 flex-shrink-0 p-3 flex flex-col gap-4 bg-gray-50/50">
        <div className="h-4 w-5/6 rounded animate-shimmer bg-gray-200" />
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-full rounded-md animate-shimmer bg-gray-100" />
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
          <div className="h-3 w-4/5 rounded animate-shimmer bg-gray-200" />
          <div className="h-4 w-full rounded animate-shimmer bg-gray-100" />
        </div>
        <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
          <div className="h-3 w-3/4 rounded animate-shimmer bg-gray-200" />
          <div className="h-5 w-full rounded animate-shimmer bg-gray-100" />
        </div>
      </div>

      {/* Main categories directory columns */}
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
        <div className="h-4 w-1/3 rounded animate-shimmer bg-gray-200 mb-2" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-3xl animate-shimmer bg-gray-100 w-full" />
        ))}
      </div>
    </div>
  );
};

export const ShimmerProductDetails: React.FC = () => {
  return (
    <div className="p-4 pb-24 flex flex-col gap-5 bg-white h-full animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-gray-100 animate-shimmer" />
        <div className="h-4 w-24 rounded bg-gray-100 animate-shimmer" />
        <div className="w-9 h-9 rounded-full bg-gray-100 animate-shimmer" />
      </div>
      <div className="w-full aspect-[4/5] rounded-3xl bg-gray-100 animate-shimmer" />
      
      <div className="flex flex-col gap-2 scale-95 origin-left">
        <div className="h-3.5 w-1/4 rounded bg-gray-100 animate-shimmer" />
        <div className="h-6 w-4/5 rounded bg-gray-100 animate-shimmer" />
        <div className="h-4 w-1/3 rounded bg-gray-100 animate-shimmer mt-2" />
        <div className="h-5 w-1/2 rounded bg-gray-100 animate-shimmer mt-1" />
      </div>

      <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
        <div className="h-4 w-full rounded bg-gray-100 animate-shimmer" />
        <div className="h-4 w-5/6 rounded bg-gray-100 animate-shimmer" />
      </div>
    </div>
  );
};

export const ShimmerCartPage: React.FC = () => {
  return (
    <div className="p-4 flex flex-col gap-4 h-full bg-white animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 rounded bg-gray-100 animate-shimmer" />
        <div className="h-3.5 w-12 rounded bg-gray-100 animate-shimmer" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 p-2 border border-gray-50 rounded-2xl bg-white shadow-soft">
          <div className="w-16 h-16 rounded-xl bg-gray-100 animate-shimmer flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <div className="h-3 w-1/4 rounded bg-gray-100 animate-shimmer" />
            <div className="h-4 w-2/3 rounded bg-gray-100 animate-shimmer" />
            <div className="h-3.5 w-1/3 rounded bg-gray-100 animate-shimmer mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ShimmerAdmin: React.FC = () => {
  return (
    <div className="p-4 flex flex-col gap-5 h-full animate-fade-in bg-white">
      {/* 3 Dashboard stats block */}
      <div className="grid grid-cols-3 gap-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-100 rounded-2xl p-2.5 bg-gray-50 flex flex-col gap-1.5 shadow-sm">
            <div className="h-3 w-10/12 rounded bg-gray-200 animate-shimmer" />
            <div className="h-5 w-2/3 rounded bg-gray-200 animate-shimmer mt-1" />
          </div>
        ))}
      </div>

      {/* Product list skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-1/4 rounded bg-gray-200 animate-shimmer" />
        <div className="border border-gray-100 rounded-2xl p-2 flex flex-col divide-y divide-gray-50">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gray-100 animate-shimmer" />
                <div className="flex flex-col gap-1">
                  <div className="h-3.5 w-20 rounded bg-gray-100 animate-shimmer" />
                  <div className="h-2.5 w-12 rounded bg-gray-100 animate-shimmer" />
                </div>
              </div>
              <div className="h-5 w-10 rounded bg-gray-100 animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
