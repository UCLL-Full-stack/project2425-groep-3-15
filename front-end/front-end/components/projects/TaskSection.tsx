// components/projects/TaskSection.tsx
import React from "react";
import TaskOverviewTable from "@/components/tasks/TaskOverviewTable";
import NewTaskForm from "@/components/tasks/NewTaskForm";
import { Project, Task } from "@types";
import { useTranslation } from "next-i18next";

type TaskSectionProps = {
  project: Project & { tasks: Task[] };
  isEditing: boolean;
  showTaskForm: boolean;
  setIsEditing: (value: boolean) => void;
  setShowTaskForm: (value: boolean) => void;
  handleTaskCreated: (newTask: Task) => void;
  handleStatusChange: (taskId: number, newStatus: boolean) => void;
  handleTaskRemoved: (taskId: number) => void;
};

const TaskSection: React.FC<TaskSectionProps> = ({
  project,
  isEditing,
  showTaskForm,
  setIsEditing,
  setShowTaskForm,
  handleTaskCreated,
  handleStatusChange,
  handleTaskRemoved,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex-1 mx-2.5 bg-white rounded-md p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t("projectDetails.tasks.title")}</h2>
        <div className="flex space-x-2">
          <button
            className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600"
            onClick={() => setShowTaskForm(!showTaskForm)}
          >
            {t("projectDetails.tasks.addtask")}
          </button>
          <button
            className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing
              ? t("projectDetails.tasks.edits")
              : t("projectDetails.tasks.edit")}
          </button>
        </div>
      </div>
      <div className="flex">
        <TaskOverviewTable
          project={project}
          onStatusChange={handleStatusChange}
          onTaskRemoved={handleTaskRemoved}
          isEditing={isEditing}
        />
        {showTaskForm && (
          <NewTaskForm
            projectId={project.projectId.toString()}
            onTaskCreated={handleTaskCreated}
            onClose={() => setShowTaskForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TaskSection;
