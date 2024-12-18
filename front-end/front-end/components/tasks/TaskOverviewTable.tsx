import React from "react";
import { Project, Task } from "@types";
import TaskService from "../../services/TaskService";
import { useTranslation } from "next-i18next";

type Props = {
  project: Project & { tasks?: Task[] };
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
  const { t } = useTranslation("common");

  const handleStatusChange = async (taskId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      onStatusChange(taskId, newStatus);
    } catch (error) {
      console.error(t("projectDetails.tasks.createError"), error);
    }
  };

  const handleRemoveTask = async (taskId: number) => {
    try {
      await TaskService.deleteTask(taskId);
      onTaskRemoved(taskId);
    } catch (error) {
      console.error(t("projectDetails.tasks.createError"), error);
    }
  };

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th className="text-left px-4 py-2">
            {t("projectDetails.tasks.name")}
          </th>
          <th className="px-4 py-2 break-words max-w-xs overflow-hidden text-ellipsis">
            {t("projectDetails.tasks.description")}
          </th>
          <th className="text-left px-4 py-2">
            {t("projectDetails.tasks.due")}
          </th>
          <th className="text-left px-4 py-2">
            {t("projectDetails.tasks.status")}
          </th>
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
              | React.ReactNode
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
              | React.ReactNode
              | React.ReactPortal
              | Iterable<React.ReactNode>
              | null
              | undefined;
            dueDate: string | number | Date;
            completed: boolean;
          }) => (
            <tr key={task.taskId} className="border-t border-gray-200">
              <td className="px-4 py-2">{task.name}</td>
              <td className="px-4 py-2 break-words max-w-xs overflow-hidden text-ellipsis">
                {task.description}
              </td>
              <td className="px-4 py-2">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              <td
                className={`px-4 py-2 ${
                  task.completed ? "text-green-500" : "text-red-500"
                }`}
              >
                {task.completed
                  ? t("projectDetails.tasks.Complete")
                  : t("projectDetails.tasks.Incomplete")}
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
                        ? t("projectDetails.tasks.markIncomplete")
                        : t("projectDetails.tasks.markComplete")}
                    </button>
                    <button
                      onClick={() => handleRemoveTask(task.taskId)}
                      className="text-white bg-red-600 hover:bg-red-700 focus:outline-none font-medium rounded-md text-xs px-3 py-1.5"
                    >
                      {t("projectDetails.tasks.remove")}
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
