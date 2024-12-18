import { useEffect, useState } from "react";
import { Project, Task } from "@types";
import ProjectService from "services/ProjectService";

const useProjectDetails = (projectId: number) => {
  const [selectedProject, setSelectedProject] = useState<
    (Project & { tasks: Task[] }) | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const project = await ProjectService.getProjectById(projectId);
        setSelectedProject(project);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleTaskCreated = (newTask: Task) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        tasks: [...selectedProject.tasks, newTask],
      });
    }
    setShowTaskForm(false);
  };

  const handleStatusChange = (taskId: number, newStatus: boolean) => {
    if (selectedProject) {
      const updatedTasks = selectedProject.tasks.map((task: Task) =>
        task.taskId === taskId ? { ...task, completed: newStatus } : task
      );
      setSelectedProject({ ...selectedProject, tasks: updatedTasks });
    }
  };

  const handleTaskRemoved = (taskId: number) => {
    if (selectedProject) {
      const updatedTasks = selectedProject.tasks.filter(
        (task: Task) => task.taskId !== taskId
      );
      setSelectedProject({ ...selectedProject, tasks: updatedTasks });
    }
  };

  const refreshProjectUsers = async () => {
    try {
      const project = await ProjectService.getProjectById(projectId);
      setSelectedProject(project);
    } catch (error) {
      console.error("Error refreshing project users:", error);
    }
  };

  return {
    selectedProject,
    isEditing,
    showTaskForm,
    setIsEditing,
    setShowTaskForm,
    handleTaskCreated,
    handleStatusChange,
    handleTaskRemoved,
    refreshProjectUsers,
  };
};

export default useProjectDetails;
