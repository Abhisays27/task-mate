import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebaseAdmin";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRef = db.collection("users").doc(session.user.email);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    await userRef.set({
      name: session.user.name,
      email: session.user.email,
      hostel: "",
      phone: "",
      createdAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
