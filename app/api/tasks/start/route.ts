export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { taskId } = await req.json();
  const ref = db.collection("tasks").doc(taskId);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const task = snap.data();

  if (task.status !== "accepted") {
    return NextResponse.json(
      { error: "Task not in accepted state" },
      { status: 400 }
    );
  }

  if (task.acceptedBy.email !== session.user.email) {
    return NextResponse.json(
      { error: "Only accepted user can start task" },
      { status: 403 }
    );
  }

  await ref.update({
    status: "in_progress",
    "timestamps.startedAt": FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true });
}
