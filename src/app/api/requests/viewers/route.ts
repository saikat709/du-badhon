import { NextResponse } from "next/server";

// Access the shared in-memory viewers map
type ViewerInfo = {
  userId: string;
  name: string;
  hallUnit: string;
  lastHeartbeat: number;
};

const globalViewers = globalThis as unknown as {
  _activeRequestViewers?: Map<string, Map<string, ViewerInfo>>;
};

export async function GET() {
  const activeViewers = globalViewers._activeRequestViewers || new Map();
  const now = Date.now();
  const result: Record<string, { userId: string; name: string; hallUnit: string }[]> = {};

  for (const [requestId, reqMap] of activeViewers.entries()) {
    const list: { userId: string; name: string; hallUnit: string }[] = [];
    for (const [userId, info] of reqMap.entries()) {
      if (now - info.lastHeartbeat < 25000) {
        list.push({
          userId: info.userId,
          name: info.name,
          hallUnit: info.hallUnit,
        });
      } else {
        reqMap.delete(userId);
      }
    }
    if (list.length > 0) {
      result[requestId] = list;
    }
  }

  return NextResponse.json({
    success: true,
    viewers: result,
  });
}
