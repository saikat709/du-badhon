"use client";

import { useBadhon } from "@/context/badhon-context";
import { CallDonorModal } from "./CallDonorModal";

export function GlobalCallingModal() {
  const { activeCallingModalDonor, setActiveCallingModalDonor } = useBadhon();

  if (!activeCallingModalDonor) return null;

  return (
    <CallDonorModal
      donor={activeCallingModalDonor}
      onClose={() => setActiveCallingModalDonor(null)}
    />
  );
}
