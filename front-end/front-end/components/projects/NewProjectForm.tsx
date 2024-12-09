import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import React, { useState } from "react";

type NewProjectFormProps = {
  onProjectCreated: (newProject: Project) => void;
  setSuccessMessage: (message: string | null) => void;
};

const NewProjectForm: React.FC<NewProjectFormProps> = ({
  onProjectCreated,
}) => {
  const [projectName, setProjectName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      onProjectCreated(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div>
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.projectName && (
            <p className="text-red-500 text-sm">{errors.projectName}</p>
          )}
        </div>
        <button
          type="submit"
          className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600 mt-4"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default NewProjectForm;
