import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import React, { useState } from "react";

type NewProjectFormProps = {
  onProjectCreated: (newProject: Project) => void;
  setSuccessMessage: (message: string | null) => void;
};

const NewProjectForm: React.FC<NewProjectFormProps> = ({
  onProjectCreated,
  setSuccessMessage,
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
      setErrors({}); // Clear any previous errors
      onProjectCreated(newProject);
    } catch (error: any) {
      // Handle the error and display it under the input field
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

  return (
    <div>
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
            <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
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
