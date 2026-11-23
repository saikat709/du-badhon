"use client";

import {
  SAMPLE_BLOOD_REQUESTS,
  SAMPLE_DONORS,
  SAMPLE_VOLUNTEERS,
} from "@/data/badhon-seed";
import {
  BagSlot,
  BloodGroup,
  BloodRequest,
  CallLog,
  CallOutcome,
  Donor,
  HallUnit,
  UrgencyLevel,
  VolunteerMember,
} from "@/types/badhon";
import React, { createContext, useContext, useEffect, useState } from "react";

interface BadhonContextType {
  volunteers: VolunteerMember[];
  currentVolunteer: VolunteerMember;
  switchVolunteer: (id: string) => void;
  donors: Donor[];
  bloodRequests: BloodRequest[];
  startCallingDonor: (donorId: string) => { success: boolean; message?: string };
  releaseCallingDonor: (donorId: string) => void;
  logCallOutcome: (
    donorId: string,
    outcome: CallOutcome,
    comment: string,
    assignToRequestId?: string,
    bagNumber?: number,
  ) => void;
  addBloodRequest: (data: {
    patientName: string;
    hospital: string;
    contactPerson: string;
    contactPhone: string;
    bloodGroup: BloodGroup;
    isPlasma: boolean;
    totalBags: number;
    urgency: UrgencyLevel;
    dateNeeded: string;
    reason: string;
    notes?: string;
  }) => BloodRequest;
  assignDonorToBag: (
    requestId: string,
    bagNumber: number,
    donorId: string,
  ) => { success: boolean; message?: string };
  unassignDonorFromBag: (requestId: string, bagNumber: number) => void;
  markRequestCompleted: (requestId: string, notes?: string) => void;
  markRequestCancelled: (requestId: string, reason: string) => void;
  addDonor: (donor: Omit<Donor, "id" | "callHistory" | "totalDonations" | "currentLock">) => Donor;
  resetToSampleData: () => void;
}

const BadhonContext = createContext<BadhonContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VOLUNTEERS: "badhon_volunteers_v1",
  CURRENT_VOLUNTEER: "badhon_current_volunteer_v1",
  DONORS: "badhon_donors_v1",
  REQUESTS: "badhon_requests_v1",
};

// Maximum lock duration before a donor lock automatically expires (10 minutes)
export const LOCK_TTL_MS = 10 * 60 * 1000;

export function isLockActive(lock: Donor["currentLock"]): boolean {
  if (!lock) return false;
  const lockTime = new Date(lock.lockedAt).getTime();
  if (isNaN(lockTime)) return false;
  return Date.now() - lockTime < LOCK_TTL_MS;
}

export function getDaysSinceDonation(lastDonationDate: string | null | undefined): number | null {
  if (!lastDonationDate) return null;
  const time = new Date(lastDonationDate).getTime();
  if (isNaN(time)) return null;
  return Math.floor(Math.max(0, Date.now() - time) / (1000 * 60 * 60 * 24));
}

export function isDonorEligible(lastDonationDate: string | null | undefined): boolean {
  const days = getDaysSinceDonation(lastDonationDate);
  if (days === null) return true; // First time donor is ready
  return days >= 90;
}

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialVolunteers(): VolunteerMember[] {
  const stored = getStored<VolunteerMember[] | null>(STORAGE_KEYS.VOLUNTEERS, null);
  if (!stored) return SAMPLE_VOLUNTEERS;
  const existingIds = new Set(stored.map((v) => v.id));
  return [...stored, ...SAMPLE_VOLUNTEERS.filter((v) => !existingIds.has(v.id))];
}

function getInitialCurrentVolunteer(): VolunteerMember {
  const stored = getStored<VolunteerMember | null>(STORAGE_KEYS.CURRENT_VOLUNTEER, null);
  if (!stored) return SAMPLE_VOLUNTEERS[0];
  return SAMPLE_VOLUNTEERS.find((v) => v.id === stored.id) || SAMPLE_VOLUNTEERS[0];
}

export function BadhonProvider({ children }: { children: React.ReactNode }) {
  const [volunteers, setVolunteers] = useState<VolunteerMember[]>(getInitialVolunteers);
  const [currentVolunteer, setCurrentVolunteer] = useState<VolunteerMember>(
    getInitialCurrentVolunteer,
  );
  const [donors, setDonors] = useState<Donor[]>(() =>
    getStored<Donor[]>(STORAGE_KEYS.DONORS, SAMPLE_DONORS),
  );
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() =>
    getStored<BloodRequest[]>(STORAGE_KEYS.REQUESTS, SAMPLE_BLOOD_REQUESTS),
  );

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(volunteers));
      localStorage.setItem(STORAGE_KEYS.CURRENT_VOLUNTEER, JSON.stringify(currentVolunteer));
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(bloodRequests));
    } catch (e) {
      console.error("Failed to persist Badhon data:", e);
    }
  }, [volunteers, currentVolunteer, donors, bloodRequests]);

  const switchVolunteer = (id: string) => {
    const found = volunteers.find((v) => v.id === id);
    if (found) {
      setCurrentVolunteer(found);
    }
  };

  const startCallingDonor = (donorId: string) => {
    const target = donors.find((d) => d.id === donorId);
    if (!target) return { success: false, message: "Donor not found." };

    // Check if active lock is held by another volunteer (respecting TTL)
    if (
      target.currentLock &&
      target.currentLock.lockedByVolunteerId !== currentVolunteer.id &&
      isLockActive(target.currentLock)
    ) {
      const lockedTime = new Date(target.currentLock.lockedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        success: false,
        message: `${target.currentLock.lockedByVolunteerName} is currently calling this donor (locked at ${lockedTime})!`,
      };
    }

    setDonors((prev) =>
      prev.map((d) =>
        d.id === donorId
          ? {
              ...d,
              currentLock: {
                lockedByVolunteerId: currentVolunteer.id,
                lockedByVolunteerName: currentVolunteer.name,
                lockedByVolunteerHall: currentVolunteer.hallUnit,
                lockedAt: new Date().toISOString(),
              },
            }
          : d,
      ),
    );
    return { success: true };
  };

  const releaseCallingDonor = (donorId: string) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, currentLock: null } : d)),
    );
  };

  const logCallOutcome = (
    donorId: string,
    outcome: CallOutcome,
    comment: string,
    assignToRequestId?: string,
    bagNumber?: number,
  ) => {
    const newCallLog: CallLog = {
      id: `call-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      volunteerId: currentVolunteer.id,
      volunteerName: currentVolunteer.name,
      volunteerHall: currentVolunteer.hallUnit,
      timestamp: new Date().toISOString(),
      outcome,
      comment: comment.trim(),
    };

    setDonors((prev) =>
      prev.map((d) => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          currentLock: null,
          callHistory: [newCallLog, ...d.callHistory],
          notes: outcome === "ineligible" ? `Marked ineligible: ${comment}` : d.notes,
        };
      }),
    );

    // If caller opted to assign directly to a blood request
    if (assignToRequestId && bagNumber != null && outcome === "agreed") {
      assignDonorToBag(assignToRequestId, bagNumber, donorId);
    }
  };

  const addBloodRequest = (data: {
    patientName: string;
    hospital: string;
    contactPerson: string;
    contactPhone: string;
    bloodGroup: BloodGroup;
    isPlasma: boolean;
    totalBags: number;
    urgency: UrgencyLevel;
    dateNeeded: string;
    reason: string;
    notes?: string;
  }) => {
    const assignedBags: BagSlot[] = Array.from(
      { length: data.totalBags },
      (_, i) => ({
        bagNumber: i + 1,
        status: "pending",
      }),
    );

    const newRequest: BloodRequest = {
      id: `BR-${100 + bloodRequests.length + 1}`,
      ...data,
      managedBags: 0,
      status: "active",
      assignedBags,
      createdAt: new Date().toISOString(),
      createdByVolunteerName: currentVolunteer.name,
    };

    setBloodRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const assignDonorToBag = (
    requestId: string,
    bagNumber: number,
    donorId: string,
  ) => {
    const donor = donors.find((d) => d.id === donorId);
    if (!donor) return { success: false, message: "Donor not found." };

    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const updatedBags = req.assignedBags.map((slot) => {
          if (slot.bagNumber === bagNumber) {
            return {
              ...slot,
              donorId: donor.id,
              donorName: donor.name,
              donorPhone: donor.phone,
              donorHall: donor.hallUnit,
              assignedAt: new Date().toISOString(),
              status: "assigned" as const,
            };
          }
          return slot;
        });

        const managedCount = updatedBags.filter((s) => s.donorId != null).length;
        const newStatus =
          managedCount >= req.totalBags
            ? ("managed" as const)
            : managedCount > 0
              ? ("partially_managed" as const)
              : ("active" as const);

        return {
          ...req,
          assignedBags: updatedBags,
          managedBags: managedCount,
          status: newStatus,
        };
      }),
    );

    return { success: true };
  };

  const unassignDonorFromBag = (requestId: string, bagNumber: number) => {
    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const updatedBags = req.assignedBags.map((slot) => {
          if (slot.bagNumber === bagNumber) {
            return {
              bagNumber: slot.bagNumber,
              status: "pending" as const,
            };
          }
          return slot;
        });

        const managedCount = updatedBags.filter((s) => s.donorId != null).length;
        const newStatus =
          managedCount >= req.totalBags
            ? ("managed" as const)
            : managedCount > 0
              ? ("partially_managed" as const)
              : ("active" as const);

        return {
          ...req,
          assignedBags: updatedBags,
          managedBags: managedCount,
          status: newStatus,
        };
      }),
    );
  };

  const markRequestCompleted = (requestId: string, notes?: string) => {
    const target = bloodRequests.find((r) => r.id === requestId);
    if (!target) return;

    // Update donors who donated
    const today = new Date().toISOString().split("T")[0];
    const donorIds = target.assignedBags
      .map((b) => b.donorId)
      .filter((id): id is string => id != null);

    setDonors((prev) =>
      prev.map((d) => {
        if (donorIds.includes(d.id)) {
          return {
            ...d,
            lastDonationDate: today,
            totalDonations: d.totalDonations + 1,
            isAvailable: true,
          };
        }
        return d;
      }),
    );

    // Update request
    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: "completed",
          notes: notes ? `${req.notes || ""}\n${notes}` : req.notes,
          assignedBags: req.assignedBags.map((b) =>
            b.donorId ? { ...b, status: "donated" } : b,
          ),
        };
      }),
    );
  };

  const markRequestCancelled = (requestId: string, reason: string) => {
    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: "cancelled",
          cancellationReason: reason,
        };
      }),
    );
  };

  const addDonor = (
    donorData: Omit<Donor, "id" | "callHistory" | "totalDonations" | "currentLock">,
  ) => {
    const newDonor: Donor = {
      ...donorData,
      id: `don-${Date.now()}`,
      totalDonations: 0,
      currentLock: null,
      callHistory: [],
    };

    setDonors((prev) => [newDonor, ...prev]);
    return newDonor;
  };

  const resetToSampleData = () => {
    setVolunteers(SAMPLE_VOLUNTEERS);
    setCurrentVolunteer(SAMPLE_VOLUNTEERS[0]);
    setDonors(SAMPLE_DONORS);
    setBloodRequests(SAMPLE_BLOOD_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.VOLUNTEERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_VOLUNTEER);
    localStorage.removeItem(STORAGE_KEYS.DONORS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
  };

  return (
    <BadhonContext.Provider
      value={{
        volunteers,
        currentVolunteer,
        switchVolunteer,
        donors,
        bloodRequests,
        startCallingDonor,
        releaseCallingDonor,
        logCallOutcome,
        addBloodRequest,
        assignDonorToBag,
        unassignDonorFromBag,
        markRequestCompleted,
        markRequestCancelled,
        addDonor,
        resetToSampleData,
      }}
    >
      {children}
    </BadhonContext.Provider>
  );
}

export function useBadhon() {
  const context = useContext(BadhonContext);
  if (!context) {
    throw new Error("useBadhon must be used within a BadhonProvider");
  }
  return context;
}
