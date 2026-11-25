import React from "react";

export default function SigninSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-3.5 animate-pulse min-h-[360px]" aria-hidden="true">
      {/* Quick Test Accounts Skeleton */}
      <div className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-dark-2/60 border border-stroke dark:border-dark-3 space-y-1.5">
        <div className="h-3 w-32 bg-gray-200 dark:bg-dark-3 rounded" />
        <div className="flex flex-wrap gap-1.5">
          <div className="h-5 w-16 bg-gray-200 dark:bg-dark-3 rounded-md" />
          <div className="h-5 w-16 bg-gray-200 dark:bg-dark-3 rounded-md" />
          <div className="h-5 w-20 bg-gray-200 dark:bg-dark-3 rounded-md" />
          <div className="h-5 w-14 bg-gray-200 dark:bg-dark-3 rounded-md" />
        </div>
      </div>

      {/* Input 1: Identifier */}
      <div className="space-y-1">
        <div className="h-3 w-36 bg-gray-200 dark:bg-dark-3 rounded" />
        <div className="h-10 w-full bg-gray-100 dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3" />
      </div>

      {/* Input 2: Password */}
      <div className="space-y-1">
        <div className="h-3 w-20 bg-gray-200 dark:bg-dark-3 rounded" />
        <div className="h-10 w-full bg-gray-100 dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3" />
      </div>

      {/* Remember me & Need Help row */}
      <div className="flex items-center justify-between py-0.5">
        <div className="h-3.5 w-32 bg-gray-200 dark:bg-dark-3 rounded" />
        <div className="h-3.5 w-16 bg-gray-200 dark:bg-dark-3 rounded" />
      </div>

      {/* Sign in button skeleton */}
      <div className="pt-0.5">
        <div className="h-10 w-full rounded-xl bg-rose-600/30 dark:bg-rose-900/40" />
      </div>
    </div>
  );
}
