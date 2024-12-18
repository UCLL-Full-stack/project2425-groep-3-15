const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import { Project } from "@types";
import { parseISO, isValid } from "date-fns";

const parseProjectDates = (project: Project): Project => {
  return {
    projectId: project.projectId,
    name: project.name,
    description: project.description,
    startDate: parseDate(project.startDate),
    endDate: parseDate(project.endDate),
    tasks: project.tasks
      ? project.tasks.map(
          (task: {
            taskId: number;
            name: string;
            description: string;
            dueDate: string | Date | null;
            completed: boolean;
          }) => {
            const parsedTaskDueDate = parseDate(task.dueDate);
            return {
              id: task.taskId,
              name: task.name,
              description: task.description,
              dueDate: parsedTaskDueDate,
              completed: task.completed,
            };
          }
        )
      : [],
    users: project.users
      ? project.users.map(
          (user: {
            userId: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
          }) => ({
            id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          })
        )
      : [],
  };
};
const parseDate = (date: string | Date | null): Date | null => {
  if (date === null) {
    return null;
  }
  if (date instanceof Date) {
    return date;
  }
  const parsedDate = parseISO(date);
  return isValid(parsedDate) ? parsedDate : null;
};

export const fetchAndParseProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${apiUrl}/projects`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Project[] = await response.json();
    const parsedData = data.map(parseProjectDates);
    return parsedData;
  } catch (error) {
    console.error("Error fetching projects", error);
    throw error;
  }
};

const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${apiUrl}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    const data: Project[] = await response.json();
    return data.map(parseProjectDates);
  } catch (error) {
    console.error("Error fetching projects", error);
    throw error;
  }
};

const getProjectById = async (projectId: number): Promise<Project> => {
  const response = await fetch(`${apiUrl}/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project details");
  }

  const project = await response.json();

  if (project.users) {
    project.users = project.users.map((userProject: any) => ({
      ...userProject,
      user: userProject.user || {
        firstName: "Unknown",
        lastName: "User",
        role: "Unknown",
      },
    }));
  }

  return project;
};

const createProject = async (projectName: string): Promise<Project> => {
  try {
    const response = await fetch(`${apiUrl}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: projectName }),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    const project: Project = await response.json();
    return parseProjectDates(project);
  } catch (error) {
    console.error("Error creating project", error);
    throw error;
  }
};

const deleteProject = async (projectId: number): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete project with ID "${projectId}"`);
    }
  } catch (error) {
    console.error(`Error deleting project with ID "${projectId}"`, error);
    throw error;
  }
};

const ProjectService = {
  getAllProjects,
  getProjectById,
  fetchAndParseProjects,
  createProject,
  deleteProject,
};

export default ProjectService;
