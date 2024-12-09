import React, { useState } from "react";
import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { t } from "i18next";

type NewProjectModalProps = {
  onProjectCreated: (newProject: Project) => void;
  setSuccessMessage: (message: string | null) => void;
  onClose: () => void; // New prop to handle closing the modal
};

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  onProjectCreated,
  setSuccessMessage,
  onClose,
}) => {
  const [projectName, setProjectName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!projectName) newErrors.projectName = "Project name is required";
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
      const newProject = await ProjectService.createProject(projectName);
      setSuccessMessage("Project created successfully!");
      setErrors({});
      onProjectCreated(newProject);
      onClose(); // Close the modal after successful project creation
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ projectName: error.response.data.message });
      } else {
        setErrors({
          projectName: "Project with this name already exists",
        });
      }
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close modal when clicking on the background
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor={t("project.name")}
              className="block text-sm font-medium"
            >
              Project Name:
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
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
              {t("project.create2")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
