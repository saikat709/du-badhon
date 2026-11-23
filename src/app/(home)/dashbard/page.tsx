"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function DashbardRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(`/dashboard${qs ? `?${qs}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-dark-5">Redirecting to Dashboard...</p>
    </div>
  );
}

export default function DashbardLegacyRedirect() {
  return (
    <Suspense>
      <DashbardRedirectContent />
    </Suspense>
  );
}
