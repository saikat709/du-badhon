import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;
      let consecutiveErrors = 0;

      const sendLocks = async () => {
        if (isClosed) return;
        if (consecutiveErrors >= 3 && consecutiveErrors % 5 !== 0) {
          consecutiveErrors++;
          return;
        }
        try {
          // Delete expired locks
          await db.callLock.deleteMany({
            where: {
              expiresAt: {
                lt: new Date(),
              },
            },
          });

          const activeLocks = await db.callLock.findMany({
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
          });

          consecutiveErrors = 0; // reset error count on success

          const payload = {
            type: "locks_update",
            timestamp: Date.now(),
            locks: activeLocks.map((lock) => ({
              id: lock.id,
              donorId: lock.donorId,
              donorName: lock.donor?.name || "Unknown Donor",
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
            })),
          };

          if (!isClosed) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          }
        } catch (e) {
          consecutiveErrors++;
          // Log only the first failure to avoid flooding Vercel logs every 2 seconds
          if (consecutiveErrors === 1) {
            console.error("Error sending SSE locks (will back off gracefully):", e);
          }
          // Send a benign empty update so client stream stays healthy without crashing
          try {
            if (!isClosed) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now(), locks: [] })}\n\n`
                )
              );
            }
          } catch {
            // stream may have closed
          }
        }
      };

      // Send initial data immediately
      await sendLocks();

      // Send updates every 2 seconds
      const interval = setInterval(async () => {
        if (isClosed) {
          clearInterval(interval);
          return;
        }
        await sendLocks();
      }, 2000);

      req.signal.addEventListener("abort", () => {
        isClosed = true;
        clearInterval(interval);
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
