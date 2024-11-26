const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import { Project } from '@types';
import { parseISO, isValid } from 'date-fns';

// Function to parse date strings into Date objects
const parseProjectDates = (project: Project): Project => {
  return {
    id: project.id, // Adjusted to match your data structure
    name: project.name,
    description: project.description,
    startDate: parseDate(project.startDate), // Parse project start date
    endDate: parseDate(project.endDate), // Parse project end date
    tasks: project.tasks.map((task: { id: string; name: string; description: string; dueDate: string | Date | null; completed: boolean }) => {
      const parsedTaskDueDate = parseDate(task.dueDate);
      return {
        id: task.id,
        name: task.name,
        description: task.description,
        dueDate: parsedTaskDueDate, // Use parsed date
        completed: task.completed,
      };
    }),
    users: project.users.map((user: { id: string; firstName: string; lastName: string; email: string; role: string }) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })),
  };
};

// Helper function to parse dates
const parseDate = (date: string | Date | null): Date | null => {
  console.log('Parsing date:', date);
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
      throw new Error('Network response was not ok');
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data: Project[] = await response.json();
    return data.map(parseProjectDates);
  } catch (error) {
    console.error("Error fetching projects", error);
    throw error;
  }
};

const getProjectById = async (projectId: string): Promise<Project> => {
  try {
    const response = await fetch(`${apiUrl}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    const project: Project = await response.json();
    return parseProjectDates(project);
  } catch (error) {
    console.error(`Error fetching project with ID "${projectId}"`, error);
    throw error;
  }
};

const createProject = async (projectName: string): Promise<Project> => {
  try {
    const response = await fetch(`${apiUrl}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: projectName }),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    const project: Project = await response.json();
    return parseProjectDates(project);
  } catch (error) {
    console.error("Error creating project", error);
    throw error;
  }
};

const ProjectService = {
  getAllProjects,
  getProjectById,
  fetchAndParseProjects,
  createProject,
};

export default ProjectService;