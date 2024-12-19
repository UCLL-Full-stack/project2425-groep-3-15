import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import TaskService from "../../services/TaskService";

type NewTaskModalProps = {
  projectId: number;
  onTaskCreated: (newTask: {
    name: string;
    description: string;
    dueDate: string;
  }) => void;
  onClose: () => void;
};

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  projectId,
  onTaskCreated,
  onClose,
}) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { t } = useTranslation("common");

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const today = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(today.getFullYear() + 50);

    if (!taskName) {
      newErrors.taskName = t("newTask.nameError");
    }

    if (!description) {
      newErrors.taskDescription = t("newTask.descriptionError");
    } else if (description.length > 50) {
      newErrors.taskDescription = t("newTask.descriptionLengthError");
    }

    if (!dueDate) {
      newErrors.taskDueDate = t("newTask.dueError");
    } else {
      const dueDateValue = new Date(dueDate);
      if (dueDateValue < today) {
        newErrors.taskDueDate = t("newTask.duePatError");
      } else if (dueDateValue > maxFutureDate) {
        newErrors.taskDueDate = t("newTask.dueFarError");
      }
    }

    setErrors(newErrors);
    return newErrors;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const newTask = await TaskService.createTask(
        projectId,
        taskName,
        description,
        dueDate
      );

      onTaskCreated(newTask);

      setTaskName("");
      setDescription("");
      setDueDate("");
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{t("common.createNewTask")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="taskName" className="block text-sm font-medium">
              {t("newTask.name")}
            </label>
            <input
              id="taskName"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.taskName && (
              <p className="text-red-500 text-sm mt-1">{errors.taskName}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              {t("newTask.description")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
            {errors.taskDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.taskDescription}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-sm font-medium">
              {t("newTask.dueDate")}
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.taskDueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.taskDueDate}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-700 bg-gray-200 px-4 py-2 rounded-md shadow hover:bg-gray-300 mr-2"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600"
            >
              {t("common.createTask")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
