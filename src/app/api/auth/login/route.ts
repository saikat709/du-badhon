import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setSessionCookie, signSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, remember } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/Phone/Email and password are required." },
        { status: 400 }
      );
    }

    const cleanIdentifier = String(identifier).trim();

    // Look up by username, phone, or email
    const user = await db.user.findFirst({
      where: {
        OR: [
          { username: cleanIdentifier.toLowerCase() },
          { phone: cleanIdentifier },
          { email: cleanIdentifier.toLowerCase() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found matching this identifier." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = await signSession(
      {
        userId: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        hallUnit: user.hallUnit,
      },
      Boolean(remember)
    );

    await setSessionCookie(token, Boolean(remember));

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        hallUnit: user.hallUnit,
        role: user.role,
        avatarBg: user.avatarBg,
        bloodGroup: user.bloodGroup,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage =
      error?.message || "An unexpected error occurred during sign in.";
    return NextResponse.json(
      {
        error: "An unexpected error occurred during sign in.",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
