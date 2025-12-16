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

  const { taskId, paymentMethod } = await req.json();

  const ref = db.collection("tasks").doc(taskId);
  const snap = await ref.get();
  const task = snap.data();

  if (!task || task.status !== "completed") {
    return NextResponse.json(
      { error: "Task not completed yet" },
      { status: 403 }
    );
  }

  if (task.createdBy.email !== session.user.email) {
    return NextResponse.json(
      { error: "Only creator can confirm payment" },
      { status: 403 }
    );
  }

  await ref.update({
    status: "paid",
    payment: {
      method: paymentMethod,
      confirmedBy: session.user.email,
      paidAt: FieldValue.serverTimestamp(),
    },
  });

  return NextResponse.json({ success: true });
}
