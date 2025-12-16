import { Timestamp } from "firebase-admin/firestore";

export function serializeTask(
  doc: FirebaseFirestore.QueryDocumentSnapshot
) {
  const data = doc.data();

  const serializeTimestamp = (ts?: Timestamp) =>
    ts ? ts.toDate().toISOString() : null;

  return {
    id: doc.id,

    // primitive fields
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category,
    status: data.status,

    // nested objects (safe)
    createdBy: data.createdBy,
    acceptedBy: data.acceptedBy ?? null,

    // 🔥 FIXED — ALL timestamps serialized
    createdAt: serializeTimestamp(data.createdAt),
    acceptedAt: serializeTimestamp(data.acceptedAt),
    startedAt: serializeTimestamp(data.startedAt),
    completedAt: serializeTimestamp(data.completedAt),
    closedAt: serializeTimestamp(data.closedAt),

    // 🔥 THIS WAS MISSING
    deadline: serializeTimestamp(data.deadline),
  };
}
