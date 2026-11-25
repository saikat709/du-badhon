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
  activeCallingModalDonor: Donor | null;
  setActiveCallingModalDonor: (donor: Donor | null) => void;
  requestViewers: Record<string, { userId: string; name: string; hallUnit: string }[]>;
  pulseViewer: (requestId: string) => void;
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
    visibleUnits?: HallUnit[];
  }) => BloodRequest;
  assignDonorToBag: (
    requestId: string,
    bagNumber: number,
    donorId: string,
  ) => { success: boolean; message?: string };
  unassignDonorFromBag: (requestId: string, bagNumber: number) => void;
  confirmBagDonation: (requestId: string, bagNumber: number) => void;
  confirmBagDonated: (requestId: string, bagNumber: number) => void;
  updateVolunteerRole: (volunteerId: string, newRole: string) => void;
  addVolunteerMember: (data: Omit<VolunteerMember, "id">) => VolunteerMember;
  markRequestCompleted: (
    requestId: string,
    notes?: string,
    managedBy?: { id: string; name: string; hall: string },
  ) => void;
  markRequestCancelled: (
    requestId: string,
    reason: string,
    managedBy?: { id: string; name: string; hall: string },
  ) => void;
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
  if (lock.expiresAt) {
    const exp = new Date(lock.expiresAt).getTime();
    if (!isNaN(exp)) return Date.now() < exp;
  }
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

function getInitialRequests(): BloodRequest[] {
  const stored = getStored<BloodRequest[] | null>(STORAGE_KEYS.REQUESTS, null);
  if (!stored) return SAMPLE_BLOOD_REQUESTS;
  const existingIds = new Set(stored.map((r) => r.id));
  return [...stored, ...SAMPLE_BLOOD_REQUESTS.filter((r) => !existingIds.has(r.id))];
}

export function BadhonProvider({ children }: { children: React.ReactNode }) {
  const [volunteers, setVolunteers] = useState<VolunteerMember[]>(getInitialVolunteers);
  const [currentVolunteer, setCurrentVolunteer] = useState<VolunteerMember>(
    getInitialCurrentVolunteer,
  );
  const [donors, setDonors] = useState<Donor[]>(() =>
    getStored<Donor[]>(STORAGE_KEYS.DONORS, SAMPLE_DONORS),
  );
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(getInitialRequests);
  const [activeCallingModalDonor, setActiveCallingModalDonor] = useState<Donor | null>(null);
  const [requestViewers, setRequestViewers] = useState<
    Record<string, { userId: string; name: string; hallUnit: string }[]>
  >({});

  // Sync with authenticated user session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentVolunteer((prev) => ({
            ...prev,
            id: data.user.id,
            name: data.user.name,
            phone: data.user.phone,
            role: data.user.role,
            hallUnit: data.user.hallUnit,
            department: data.user.department,
            studentId: data.user.studentId,
            avatarBg: data.user.avatarBg || prev.avatarBg,
          }));
        }
      })
      .catch(() => {
        // use fallback initial
      });
  }, []);

  // Realtime Call Locks Sync via SSE (/api/locks/stream)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let es: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const applyLocksUpdate = (
      serverLocks: Array<{
        donorId: string;
        lockedByUserId: string;
        lockedByUserName: string;
        lockedByUserHall: string;
        lockedAt: string;
        expiresAt: string;
      }>,
    ) => {
      const lockMap = new Map(serverLocks.map((l) => [l.donorId, l]));
      setDonors((prev) =>
        prev.map((d) => {
          const sl = lockMap.get(d.id);
          if (sl) {
            return {
              ...d,
              currentLock: {
                lockedByVolunteerId: sl.lockedByUserId,
                lockedByVolunteerName: sl.lockedByUserName,
                lockedByVolunteerHall: sl.lockedByUserHall,
                lockedAt: sl.lockedAt,
                expiresAt: sl.expiresAt,
              },
            };
          } else if (d.currentLock) {
            return { ...d, currentLock: null };
          }
          return d;
        }),
      );
    };

    const pollFallback = async () => {
      try {
        const res = await fetch("/api/locks");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.locks)) {
            applyLocksUpdate(data.locks);
          }
        }
      } catch {
        // network error
      }
    };

    try {
      es = new EventSource("/api/locks/stream");
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.type === "locks_update" && Array.isArray(data.locks)) {
            applyLocksUpdate(data.locks);
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
          }
        } catch {
          // ignore comments/heartbeats
        }
      };
      es.onerror = () => {
        if (!pollInterval) {
          pollInterval = setInterval(pollFallback, 8000);
        }
      };
    } catch {
      pollInterval = setInterval(pollFallback, 4000);
    }

    return () => {
      if (es) es.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  // Multi-volunteer search indicators heartbeat poll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchViewers = async () => {
      try {
        const res = await fetch("/api/requests/viewers");
        if (res.ok) {
          const data = await res.json();
          if (data?.viewers) {
            setRequestViewers(data.viewers);
          }
        }
      } catch {
        // ignore
      }
    };

    fetchViewers();
    const interval = setInterval(fetchViewers, 8000);
    return () => clearInterval(interval);
  }, []);

  const pulseViewer = (requestId: string) => {
    fetch(`/api/requests/${requestId}/viewers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentVolunteer.id,
        name: currentVolunteer.name,
        hallUnit: currentVolunteer.hallUnit,
      }),
    }).catch(() => {});
  };

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

    const now = new Date();
    const expires = new Date(now.getTime() + 180 * 1000);

    const newLock = {
      lockedByVolunteerId: currentVolunteer.id,
      lockedByVolunteerName: currentVolunteer.name,
      lockedByVolunteerHall: currentVolunteer.hallUnit,
      lockedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, currentLock: newLock } : d)),
    );

    // Call server to persist and broadcast lock
    fetch("/api/locks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donorId, ttlSeconds: 180 }),
    }).catch(() => {});

    return { success: true };
  };

  const releaseCallingDonor = (donorId: string) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, currentLock: null } : d)),
    );

    // Release on server
    fetch(`/api/locks?donorId=${donorId}`, {
      method: "DELETE",
    }).catch(() => {});
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

    // Release lock on server
    fetch(`/api/locks?donorId=${donorId}`, {
      method: "DELETE",
    }).catch(() => {});

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
    visibleUnits?: HallUnit[];
  }) => {
    const assignedBags: BagSlot[] = Array.from(
      { length: data.totalBags },
      (_, i) => ({
        bagNumber: i + 1,
        status: "pending",
      }),
    );

    // Ensure creator's own unit is always in visibleUnits
    const finalVisibleUnits = data.visibleUnits && data.visibleUnits.length > 0
      ? (data.visibleUnits.includes(currentVolunteer.hallUnit)
          ? data.visibleUnits
          : [currentVolunteer.hallUnit, ...data.visibleUnits])
      : [currentVolunteer.hallUnit];

    const newRequest: BloodRequest = {
      id: `BR-${100 + bloodRequests.length + 1}`,
      ...data,
      visibleUnits: finalVisibleUnits,
      managedBags: 0,
      status: "active",
      assignedBags,
      createdAt: new Date().toISOString(),
      createdByVolunteerName: currentVolunteer.name,
      createdByVolunteerHall: currentVolunteer.hallUnit,
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
              managedByVolunteerId: currentVolunteer.id,
              managedByVolunteerName: currentVolunteer.name,
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
          managedByVolunteerId: req.managedByVolunteerId || currentVolunteer.id,
          managedByVolunteerName: req.managedByVolunteerName || currentVolunteer.name,
          managedByVolunteerHall: req.managedByVolunteerHall || currentVolunteer.hallUnit,
          managedAt: req.managedAt || new Date().toISOString(),
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

  const confirmBagDonation = (requestId: string, bagNumber: number) => {
    const target = bloodRequests.find((r) => r.id === requestId);
    if (!target) return;

    const bag = target.assignedBags.find((b) => b.bagNumber === bagNumber);
    if (!bag || !bag.donorId) return;

    const now = new Date().toISOString();
    const today = now.split("T")[0];

    // Update donor records
    setDonors((prev) =>
      prev.map((d) =>
        d.id === bag.donorId
          ? {
              ...d,
              lastDonationDate: today,
              totalDonations: d.totalDonations + 1,
              isAvailable: true,
            }
          : d,
      ),
    );

    // Update bag slot status
    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const updatedBags = req.assignedBags.map((b) =>
          b.bagNumber === bagNumber
            ? {
                ...b,
                status: "donated" as const,
                donatedAt: now,
                managedByVolunteerId: b.managedByVolunteerId || currentVolunteer.id,
                managedByVolunteerName: b.managedByVolunteerName || currentVolunteer.name,
              }
            : b,
        );
        const allDonated = updatedBags.every((b) => b.status === "donated");
        return {
          ...req,
          assignedBags: updatedBags,
          status: allDonated ? "completed" : req.status,
          completedAt: allDonated ? now : req.completedAt,
        };
      }),
    );
  };

  const updateVolunteerRole = (volunteerId: string, newRole: string) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === volunteerId ? { ...v, role: newRole } : v)),
    );
    if (currentVolunteer.id === volunteerId) {
      setCurrentVolunteer((prev) => ({ ...prev, role: newRole }));
    }
  };

  const addVolunteerMember = (data: Omit<VolunteerMember, "id">): VolunteerMember => {
    const newMember: VolunteerMember = {
      ...data,
      id: `vol-${Date.now()}`,
    };
    setVolunteers((prev) => [newMember, ...prev]);
    return newMember;
  };

  const markRequestCompleted = (
    requestId: string,
    notes?: string,
    managedBy?: { id: string; name: string; hall: string },
  ) => {
    const target = bloodRequests.find((r) => r.id === requestId);
    if (!target) return;

    const now = new Date().toISOString();
    const volunteerId = managedBy?.id || currentVolunteer.id;
    const volunteerName = managedBy?.name || currentVolunteer.name;
    const volunteerHall = managedBy?.hall || currentVolunteer.hallUnit;

    // Update donors who donated
    const today = now.split("T")[0];
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
          completedAt: now,
          managedAt: req.managedAt || now,
          managedByVolunteerId: req.managedByVolunteerId || volunteerId,
          managedByVolunteerName: req.managedByVolunteerName || volunteerName,
          managedByVolunteerHall: req.managedByVolunteerHall || volunteerHall,
          assignedBags: req.assignedBags.map((b) =>
            b.donorId
              ? {
                  ...b,
                  status: "donated" as const,
                  managedByVolunteerId: b.managedByVolunteerId || volunteerId,
                  managedByVolunteerName: b.managedByVolunteerName || volunteerName,
                }
              : b,
          ),
        };
      }),
    );
  };

  const markRequestCancelled = (
    requestId: string,
    reason: string,
    managedBy?: { id: string; name: string; hall: string },
  ) => {
    const now = new Date().toISOString();
    const volunteerId = managedBy?.id || currentVolunteer.id;
    const volunteerName = managedBy?.name || currentVolunteer.name;
    const volunteerHall = managedBy?.hall || currentVolunteer.hallUnit;

    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: "cancelled",
          cancellationReason: reason,
          cancelledAt: now,
          managedAt: req.managedAt || now,
          managedByVolunteerId: req.managedByVolunteerId || volunteerId,
          managedByVolunteerName: req.managedByVolunteerName || volunteerName,
          managedByVolunteerHall: req.managedByVolunteerHall || volunteerHall,
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
        activeCallingModalDonor,
        setActiveCallingModalDonor,
        requestViewers,
        pulseViewer,
        startCallingDonor,
        releaseCallingDonor,
        logCallOutcome,
        addBloodRequest,
        assignDonorToBag,
        unassignDonorFromBag,
        markRequestCompleted,
        markRequestCancelled,
        confirmBagDonation,
        confirmBagDonated: confirmBagDonation,
        updateVolunteerRole,
        addVolunteerMember,
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
