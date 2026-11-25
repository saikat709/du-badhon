import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    // Delete any expired locks first
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
      orderBy: {
        lockedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      locks: activeLocks.map((lock) => ({
        id: lock.id,
        donorId: lock.donorId,
        donorName: lock.donor.name,
        donorPhone: lock.donor.phone,
        donorBloodGroup: lock.donor.bloodGroup,
        donorHall: lock.donor.hallUnit,
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
    });
  } catch (error) {
    console.error("GET /api/locks error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch locks" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to acquire a call lock." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { donorId, ttlSeconds = 180 } = body;

    if (!donorId) {
      return NextResponse.json(
        { success: false, message: "Donor ID is required" },
        { status: 400 },
      );
    }

    // Check if donor exists
    const donor = await db.donor.findUnique({
      where: { id: donorId },
    });

    if (!donor) {
      return NextResponse.json(
        { success: false, message: "Donor not found" },
        { status: 404 },
      );
    }

    const now = new Date();
    // Check if an unexpired lock exists by another volunteer
    const existingLock = await db.callLock.findUnique({
      where: { donorId },
    });

    if (existingLock && existingLock.expiresAt > now && existingLock.lockedByUserId !== session.id) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          message: `${existingLock.lockedByUserName} (${existingLock.lockedByUserHall}) is already calling this donor!`,
          lock: {
            donorId: existingLock.donorId,
            lockedByUserName: existingLock.lockedByUserName,
            lockedByUserHall: existingLock.lockedByUserHall,
            expiresAt: existingLock.expiresAt.toISOString(),
            remainingSeconds: Math.max(
              0,
              Math.floor((existingLock.expiresAt.getTime() - Date.now()) / 1000),
            ),
          },
        },
        { status: 409 },
      );
    }

    const expiresAt = new Date(Date.now() + Math.max(30, ttlSeconds) * 1000);

    // Upsert lock
    const lock = await db.callLock.upsert({
      where: { donorId },
      update: {
        lockedByUserId: session.id || session.userId || "",
        lockedByUserName: session.name,
        lockedByUserHall: session.hallUnit || "",
        lockedAt: now,
        expiresAt,
      },
      create: {
        donorId,
        lockedByUserId: session.id || session.userId || "",
        lockedByUserName: session.name,
        lockedByUserHall: session.hallUnit || "",
        lockedAt: now,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      lock: {
        id: lock.id,
        donorId: lock.donorId,
        lockedByUserId: lock.lockedByUserId,
        lockedByUserName: lock.lockedByUserName,
        lockedByUserHall: lock.lockedByUserHall,
        lockedAt: lock.lockedAt.toISOString(),
        expiresAt: lock.expiresAt.toISOString(),
        remainingSeconds: Math.max(
          0,
          Math.floor((lock.expiresAt.getTime() - Date.now()) / 1000),
        ),
      },
    });
  } catch (error) {
    console.error("POST /api/locks error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to acquire lock" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    let donorId = searchParams.get("donorId");

    if (!donorId) {
      try {
        const body = await req.json();
        donorId = body.donorId;
      } catch {
        // query param was checked
      }
    }

    if (!donorId) {
      // If no donorId specified, release all locks held by this user
      await db.callLock.deleteMany({
        where: {
          lockedByUserId: session.id,
        },
      });
      return NextResponse.json({ success: true, message: "All user locks released" });
    }

    // Release specific donor lock if owned by user or if admin
    const lock = await db.callLock.findUnique({
      where: { donorId },
    });

    if (!lock) {
      return NextResponse.json({ success: true, message: "Lock not found or already released" });
    }

    if (lock.lockedByUserId === session.id || session.role === "ADMIN" || session.role === "PRESIDENT") {
      await db.callLock.delete({
        where: { donorId },
      });
      return NextResponse.json({ success: true, message: "Lock released" });
    }

    return NextResponse.json(
      { success: false, message: "You do not own this call lock" },
      { status: 403 },
    );
  } catch (error) {
    console.error("DELETE /api/locks error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to release lock" },
      { status: 500 },
    );
  }
}
