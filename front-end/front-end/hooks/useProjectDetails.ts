// hooks/useProjectDetails.ts
import { useEffect, useState } from "react";
import { Project, Task } from "@types";

const useProjectDetails = (projectId: string | string[] | undefined) => {
  const [selectedProject, setSelectedProject] = useState<
    (Project & { tasks: Task[] }) | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`
          );
          const data = await response.json();
          setSelectedProject(data);
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };
      fetchProject();
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

  return {
    selectedProject,
    isEditing,
    showTaskForm,
    setIsEditing,
    setShowTaskForm,
    handleTaskCreated,
    handleStatusChange,
    handleTaskRemoved,
  };
};

export default useProjectDetails;
