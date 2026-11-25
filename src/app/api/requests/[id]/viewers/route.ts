import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// In-memory store for active searchers per requisition
// Key: requestId -> Map<userId, { userId, name, hall, timestamp }>
type ViewerInfo = {
  userId: string;
  name: string;
  hallUnit: string;
  lastHeartbeat: number;
};

// Global map surviving across hot-reloads/invocations within the node process
const globalViewers = globalThis as unknown as {
  _activeRequestViewers?: Map<string, Map<string, ViewerInfo>>;
};

if (!globalViewers._activeRequestViewers) {
  globalViewers._activeRequestViewers = new Map();
}

const activeViewers = globalViewers._activeRequestViewers;

function getActiveViewersForRequest(requestId: string): ViewerInfo[] {
  const reqMap = activeViewers.get(requestId);
  if (!reqMap) return [];

  const now = Date.now();
  const valid: ViewerInfo[] = [];

  for (const [userId, info] of reqMap.entries()) {
    // Keep viewers who checked in within the last 25 seconds
    if (now - info.lastHeartbeat < 25000) {
      valid.push(info);
    } else {
      reqMap.delete(userId);
    }
  }

  return valid;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: requestId } = await params;
    const viewers = getActiveViewersForRequest(requestId);
    return NextResponse.json({ success: true, viewers });
  } catch (error) {
    console.error("GET viewers error:", error);
    return NextResponse.json({ success: false, viewers: [] });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: requestId } = await params;
    const session = await getSession();

    let userId = session?.id;
    let name = session?.name;
    let hallUnit = session?.hallUnit;

    if (!userId) {
      // Allow fallback if sent in body for anonymous/demo sync
      try {
        const body = await req.json();
        userId = body.userId;
        name = body.name;
        hallUnit = body.hallUnit;
      } catch {
        // empty body
      }
    }

    if (!userId || !name) {
      return NextResponse.json(
        { success: false, message: "Unauthorized or missing user details" },
        { status: 401 },
      );
    }

    if (!activeViewers.has(requestId)) {
      activeViewers.set(requestId, new Map());
    }

    const reqMap = activeViewers.get(requestId)!;
    reqMap.set(userId, {
      userId,
      name,
      hallUnit: hallUnit || "University of Dhaka",
      lastHeartbeat: Date.now(),
    });

    const viewers = getActiveViewersForRequest(requestId);
    return NextResponse.json({ success: true, viewers });
  } catch (error) {
    console.error("POST viewers error:", error);
    return NextResponse.json({ success: false, message: "Failed to record heartbeat" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: requestId } = await params;
    const session = await getSession();
    const userId = session?.id || session?.userId;
    if (userId && activeViewers.has(requestId)) {
      activeViewers.get(requestId)!.delete(userId);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE viewers error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
