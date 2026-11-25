import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, department, bloodGroup, bio, currentPassword, newPassword } = body;

    const user = await db.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: {
      name?: string;
      phone?: string;
      department?: string;
      bloodGroup?: string;
      bio?: string;
      passwordHash?: string;
    } = {};

    if (name) updateData.name = String(name).trim();
    if (phone) updateData.phone = String(phone).trim();
    if (department) updateData.department = String(department).trim();
    if (bloodGroup) updateData.bloodGroup = String(bloodGroup).trim();
    if (bio !== undefined) updateData.bio = String(bio).trim();

    // Password change request
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      const isMatch = await bcrypt.compare(String(currentPassword), user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password does not match." },
          { status: 400 }
        );
      }
      if (String(newPassword).length < 4) {
        return NextResponse.json(
          { error: "New password must be at least 4 characters long." },
          { status: 400 }
        );
      }
      updateData.passwordHash = await bcrypt.hash(String(newPassword), 10);
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        phone: true,
        email: true,
        studentId: true,
        department: true,
        hallUnit: true,
        role: true,
        avatarBg: true,
        bloodGroup: true,
        bio: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
