export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  console.log("SESSION:", session);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { taskId } = await req.json();

  if (!taskId) {
    return NextResponse.json(
      { error: "Missing taskId" },
      { status: 400 }
    );
  }

  const taskRef = db.collection("tasks").doc(taskId);
  const snap = await taskRef.get();

  if (!snap.exists) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  const task = snap.data();

  // Creator cannot accept own task
  if (task?.createdBy?.email === session.user.email) {
    return NextResponse.json(
      { error: "You cannot accept your own task" },
      { status: 403 }
    );
  }

  // Only open tasks
  if (task?.status !== "open") {
    return NextResponse.json(
      { error: "Task is not open" },
      { status: 400 }
    );
  }

  await taskRef.update({
    status: "accepted",
    acceptedBy: {
      email: session.user.email,
      name: session.user.name,
    },
    acceptedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true });
}
