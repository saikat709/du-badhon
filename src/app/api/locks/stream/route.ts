import {
  getActiveLocks,
  getLocksEmitter,
  SanitizedLock,
} from "@/lib/locks-manager";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const encoder = new TextEncoder();
  const emitter = getLocksEmitter();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;
      let currentLocks: SanitizedLock[] = [];

      const sendPayload = (locks: SanitizedLock[]) => {
        if (isClosed) return;
        currentLocks = locks;
        try {
          const payload = {
            type: "locks_update",
            timestamp: Date.now(),
            locks,
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
          );
        } catch {
          // Stream might have terminated
        }
      };

      // Listener for real-time changes
      const onLocksUpdated = (updatedLocks: SanitizedLock[]) => {
        sendPayload(updatedLocks);
      };

      emitter.on("locks_updated", onLocksUpdated);

      // Send initial data immediately
      try {
        const initialLocks = await getActiveLocks();
        sendPayload(initialLocks);
      } catch {
        sendPayload([]);
      }

      // In-memory timer for ticking active lock timers down without querying the database
      const interval = setInterval(async () => {
        if (isClosed) {
          clearInterval(interval);
          return;
        }

        const now = Date.now();

        if (currentLocks.length > 0) {
          // Decrement in-memory timers
          const updated = currentLocks
            .filter((l) => new Date(l.expiresAt).getTime() > now)
            .map((l) => ({
              ...l,
              remainingSeconds: Math.max(
                0,
                Math.floor((new Date(l.expiresAt).getTime() - now) / 1000),
              ),
            }));

          sendPayload(updated);
        } else {
          // When idle with no active locks, simply send an SSE heartbeat comment
          // to keep the connection open without making database queries
          try {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          } catch {
            // stream closed
          }
        }
      }, 3000);

      req.signal.addEventListener("abort", () => {
        isClosed = true;
        clearInterval(interval);
        emitter.off("locks_updated", onLocksUpdated);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform, no-store",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
