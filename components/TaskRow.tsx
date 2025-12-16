"use client";

type TaskRowProps = {
  task: any;
  role: "creator" | "acceptor";
};

export default function TaskRow({ task, role }: TaskRowProps) {
  async function callApi(endpoint: string) {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id }),
    });

    location.reload();
  }

  return (
    <div className="border border-gray-700 rounded p-4 space-y-2">
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-400">{task.description}</p>
      </div>

      <div className="text-sm">
        <span>Status:</span>{" "}
        <span className="font-medium">{task.status}</span>
      </div>

      {/* ACCEPTOR ACTIONS */}
      {role === "acceptor" && task.status === "accepted" && (
        <button
          onClick={() => callApi("/api/tasks/start")}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Start Task
        </button>
      )}

      {role === "acceptor" && task.status === "in_progress" && (
        <button
          onClick={() => callApi("/api/tasks/complete")}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Mark Completed
        </button>
      )}

      {/* CREATOR ACTIONS */}
      {role === "creator" && task.status === "completed" && (
        <button
          onClick={() => callApi("/api/tasks/confirm")}
          className="px-3 py-1 bg-purple-600 text-white rounded"
        >
          Confirm Completion
        </button>
      )}
    </div>
  );
}
