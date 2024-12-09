import React from "react";
import { Project, Task } from "@types";
import TaskService from "@/services/TaskService";

type Props = {
  project: Project & { tasks: Task[] };
  onStatusChange: (taskId: number, newStatus: boolean) => void;
  onTaskRemoved: (taskId: number) => void;
  isEditing: boolean;
};

const TaskOverviewTable: React.FC<Props> = ({
  project,
  onStatusChange,
  onTaskRemoved,
  isEditing,
}) => {
  const handleStatusChange = async (taskId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      onStatusChange(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleRemoveTask = async (taskId: number) => {
    try {
      await TaskService.deleteTask(taskId);
      onTaskRemoved(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th className="text-left px-4 py-2">Name</th>
          <th className="text-left px-4 py-2">Description</th>
          <th className="text-left px-4 py-2">Due Date</th>
          <th className="text-left px-4 py-2">Status</th>
          {isEditing && <th className="text-right px-4 py-2"></th>}
        </tr>
      </thead>
      <tbody>
        {project.tasks.map(
          (task: {
            taskId: number;
            name:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | React.ReactFragment
              | React.ReactPortal
              | Iterable<React.ReactNode>
              | null
              | undefined;
            description:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | React.ReactFragment
              | React.ReactPortal
              | Iterable<React.ReactNode>
              | null
              | undefined;
            dueDate: string | number | Date;
            completed: boolean;
          }) => (
            <tr key={task.taskId} className="border-t border-gray-200">
              <td className="px-4 py-2">{task.name}</td>
              <td className="px-4 py-2">{task.description}</td>
              <td className="px-4 py-2">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              <td
                className={`px-4 py-2 ${
                  task.completed ? "text-green-500" : "text-red-500"
                }`}
              >
                {task.completed ? "Completed" : "Not Completed"}
              </td>
              {isEditing && (
                <td className="px-4 py-2">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        handleStatusChange(task.taskId, task.completed)
                      }
                      className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-md text-xs px-3 py-1.5"
                    >
                      {task.completed
                        ? "Mark as Incomplete"
                        : "Mark as Completed"}
                    </button>
                    <button
                      onClick={() => handleRemoveTask(task.taskId)}
                      className="text-white bg-red-600 hover:bg-red-700 focus:outline-none font-medium rounded-md text-xs px-3 py-1.5"
                    >
                      Remove Task
                    </button>
                  </div>
                </td>
              )}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default TaskOverviewTable;
