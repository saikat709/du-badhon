interface ActiveViewer {
  userId: string;
  name: string;
  hallUnit: string;
  updatedAt: number; // timestamp ms
}

declare global {
  var __requestViewersMap: Map<string, Map<string, ActiveViewer>> | undefined;
}

const viewersMap =
  global.__requestViewersMap || new Map<string, Map<string, ActiveViewer>>();

if (process.env.NODE_ENV !== "production") {
  global.__requestViewersMap = viewersMap;
}

const VIEWER_TTL_MS = 25 * 1000; // 25 seconds heartbeat TTL

export function recordViewer(
  requestId: string,
  user: { userId: string; name: string; hallUnit: string },
) {
  if (!viewersMap.has(requestId)) {
    viewersMap.set(requestId, new Map());
  }
  const reqViewers = viewersMap.get(requestId)!;
  reqViewers.set(user.userId, {
    userId: user.userId,
    name: user.name,
    hallUnit: user.hallUnit,
    updatedAt: Date.now(),
  });
}

export function getViewersForRequest(requestId: string): ActiveViewer[] {
  const reqViewers = viewersMap.get(requestId);
  if (!reqViewers) return [];

  const now = Date.now();
  const active: ActiveViewer[] = [];

  for (const [userId, viewer] of reqViewers.entries()) {
    if (now - viewer.updatedAt < VIEWER_TTL_MS) {
      active.push(viewer);
    } else {
      reqViewers.delete(userId);
    }
  }

  return active;
}

export function getAllActiveViewers(): Record<string, ActiveViewer[]> {
  const now = Date.now();
  const result: Record<string, ActiveViewer[]> = {};

  for (const [requestId, reqViewers] of viewersMap.entries()) {
    const active: ActiveViewer[] = [];
    for (const [userId, viewer] of reqViewers.entries()) {
      if (now - viewer.updatedAt < VIEWER_TTL_MS) {
        active.push(viewer);
      } else {
        reqViewers.delete(userId);
      }
    }
    if (active.length > 0) {
      result[requestId] = active;
    }
  }

  return result;
}
