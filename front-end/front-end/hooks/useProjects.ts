// hooks/useProjects.ts
import { useState, useEffect } from "react";
import { Project } from "@types";
import ProjectService from "@/services/ProjectService";
import { useTranslation } from "next-i18next";

const useProjects = () => {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ProjectService.fetchAndParseProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setSuccessMessage(t("project.successMessage"));
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.projectId !== projectId)
      );
      setSuccessMessage(t("project.deleteSuccessMessage"));
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(t("project.deleteError"), error);
    }
  };

  return {
    projects,
    successMessage,
    setSuccessMessage,
    handleProjectCreated,
    handleDeleteProject,
  };
};

export default useProjects;
