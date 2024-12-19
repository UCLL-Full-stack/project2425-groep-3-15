import React, { useState } from "react";
import ProjectService from "../../services/ProjectService";
import { Project } from "../../types";
import { useTranslation } from "next-i18next";

type NewProjectModalProps = {
  onProjectCreated: (newProject: Project) => void;
  setSuccessMessage: (message: string | null) => void;
  onClose: () => void;
};

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  onProjectCreated,
  setSuccessMessage,
  onClose,
}) => {
  const [projectName, setProjectName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { t } = useTranslation("common");

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!projectName) newErrors.projectName = t("project.nameRequired");
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
      setSuccessMessage(t("project.successMessage"));
      setErrors({});
      onProjectCreated(newProject);
      onClose();
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ projectName: error.response.data.message });
      } else {
        setErrors({
          projectName: t("project.existsMessage"),
        });
      }
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
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {t("project.create2")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-700"
            >
              {t("project.name")}
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-2">{errors.projectName}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 bg-gray-200 px-4 py-2 rounded-md shadow hover:bg-gray-300 transition"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="text-white bg-blue-600 px-5 py-2 rounded-md shadow hover:bg-blue-700 transition"
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
