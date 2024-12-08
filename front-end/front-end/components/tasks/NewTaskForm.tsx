import React, { useState } from "react";
import TaskService from "@/services/TaskService";
import { useTranslation } from "next-i18next";

type NewTaskModalProps = {
  projectId: string;
  onTaskCreated: (newTask: {
    name: string;
    description: string;
    dueDate: string;
  }) => void;
  onClose: () => void; // Close modal handler
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
    if (!taskName) newErrors.taskName = t("projectDetails.tasks.nameError");
    if (!description)
      newErrors.taskDescription = t("projectDetails.tasks.descriptionError");
    if (!dueDate) {
      newErrors.taskDueDate = t("projectDetails.tasks.dueError");
    } else {
      const today = new Date();
      const dueDateValue = new Date(dueDate);
      if (dueDateValue < today) {
        newErrors.taskDueDate = t("projectDetails.tasks.duePatError");
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newTask = { name: taskName, description, dueDate };
    onTaskCreated(newTask); // Pass the new task back to the parent component
    onClose(); // Close the modal
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
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="taskName" className="block text-sm font-medium">
              Task Name:
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
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-sm font-medium">
              Due Date:
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-700 bg-gray-200 px-4 py-2 rounded-md shadow hover:bg-gray-300 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
