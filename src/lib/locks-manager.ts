import { db } from "@/lib/db";
import { EventEmitter } from "node:events";

export type SanitizedLock = {
  id: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  donorBloodGroup: string;
  donorHall: string;
  lockedByUserId: string;
  lockedByUserName: string;
  lockedByUserHall: string;
  lockedAt: string;
  expiresAt: string;
  remainingSeconds: number;
};

type GlobalLocksState = {
  emitter?: EventEmitter;
  cache?: SanitizedLock[];
  lastFetchTime?: number;
};

const globalForLocks = globalThis as unknown as {
  _badhonLocksState?: GlobalLocksState;
};

if (!globalForLocks._badhonLocksState) {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(250);
  globalForLocks._badhonLocksState = {
    emitter,
    cache: [],
    lastFetchTime: 0,
  };
}

const state = globalForLocks._badhonLocksState;

export function getLocksEmitter(): EventEmitter {
  return state.emitter!;
}

export function broadcastLocksUpdate(locks: SanitizedLock[]) {
  state.cache = locks;
  state.lastFetchTime = Date.now();
  state.emitter?.emit("locks_updated", locks);
}

export async function fetchActiveLocksFromDb(): Promise<SanitizedLock[]> {
  try {
    const now = new Date();
    const activeLocks = await db.callLock.findMany({
      where: {
        expiresAt: {
          gt: now,
        },
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            phone: true,
            bloodGroup: true,
            hallUnit: true,
          },
        },
      },
      orderBy: {
        lockedAt: "desc",
      },
    });

    const sanitized: SanitizedLock[] = activeLocks.map((lock) => ({
      id: lock.id,
      donorId: lock.donorId,
      donorName: lock.donor?.name || "Unknown Donor",
      donorPhone: lock.donor?.phone || "",
      donorBloodGroup: lock.donor?.bloodGroup || "",
      donorHall: lock.donor?.hallUnit || "",
      lockedByUserId: lock.lockedByUserId,
      lockedByUserName: lock.lockedByUserName,
      lockedByUserHall: lock.lockedByUserHall,
      lockedAt: lock.lockedAt.toISOString(),
      expiresAt: lock.expiresAt.toISOString(),
      remainingSeconds: Math.max(
        0,
        Math.floor((lock.expiresAt.getTime() - Date.now()) / 1000),
      ),
    }));

    state.cache = sanitized;
    state.lastFetchTime = Date.now();

    // Clean up expired records in DB asynchronously in the background
    db.callLock
      .deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      })
      .catch(() => {});

    return sanitized;
  } catch {
    // If a transient socket disconnect occurs, return cached locks with updated time offsets
    const nowMs = Date.now();
    return (state.cache || [])
      .filter((l) => new Date(l.expiresAt).getTime() > nowMs)
      .map((l) => ({
        ...l,
        remainingSeconds: Math.max(
          0,
          Math.floor((new Date(l.expiresAt).getTime() - nowMs) / 1000),
        ),
      }));
  }
}

export async function getActiveLocks(forceRefresh = false): Promise<SanitizedLock[]> {
  const now = Date.now();
  const cacheAge = now - (state.lastFetchTime || 0);

  // Return cached result if recent (within 8 seconds) and not forcing refresh
  if (!forceRefresh && state.cache && cacheAge < 8000) {
    return state.cache
      .filter((l) => new Date(l.expiresAt).getTime() > now)
      .map((l) => ({
        ...l,
        remainingSeconds: Math.max(
          0,
          Math.floor((new Date(l.expiresAt).getTime() - now) / 1000),
        ),
      }));
  }

  return await fetchActiveLocksFromDb();
}
