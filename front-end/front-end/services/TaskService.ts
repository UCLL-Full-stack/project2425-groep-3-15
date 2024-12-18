const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const createTask = async (
  projectId: number,
  taskName: string,
  taskDescription: string,
  taskDueDate: string
) => {
  const response = await fetch(`${apiUrl}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: taskName,
      description: taskDescription,
      dueDate: taskDueDate,
    }),
  });

  if (!response.ok) {
    throw new Error("Error creating task");
  }

  return response.json();
};

const updateTaskStatus = async (taskId: number, completed: boolean) => {
  try {
    const response = await fetch(`${apiUrl}/projects/tasks/${taskId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

const deleteTask = async (taskId: number) => {
  const response = await fetch(`${apiUrl}/projects/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error deleting task");
  }

  return response.json();
};

const TaskService = {
  createTask,
  updateTaskStatus,
  deleteTask,
};

export default TaskService;
