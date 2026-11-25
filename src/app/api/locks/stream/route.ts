import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      const sendLocks = async () => {
        if (isClosed) return;
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

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch (e) {
          // If connection is aborted or error happens
          console.error("Error sending SSE locks:", e);
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
