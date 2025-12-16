import { db } from "@/lib/firebaseAdmin";
import TaskCard from "@/components/TaskCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  // 🔐 Protect route
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // 🔍 Fetch only OPEN tasks
  const snapshot = await db
    .collection("tasks")
    .where("status", "==", "open")
    .orderBy("createdAt", "desc")
    .get();

  // 🔄 Serialize Firestore data (IMPORTANT)
  const tasks = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      status: data.status,
      createdBy: data.createdBy,
      acceptedBy: data.acceptedBy ?? null,
      createdAt: data.createdAt?.toMillis() ?? null,
      deadline: data.deadline?.toMillis() ?? null,
    };
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Available Tasks</h1>

      {tasks.length === 0 && (
        <p className="text-gray-500">No open tasks right now.</p>
      )}

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
