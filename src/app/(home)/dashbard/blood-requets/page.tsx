"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LegacyBloodRequestRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/blood-requests");
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-dark-5">Redirecting to Blood Requests...</p>
    </div>
  );
}
