import database from './database';
import { Project } from '../model/project';

async function createProject(name: string, description?: string, startDate?: Date, endDate?: Date) {
    try {
      const project = await database.project.create({
        data: {
          name,
        },
      });
      return project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
};

const getAllProjects = async () => {
    try {
      return await database.project.findMany({
        include: {
          users: true,
          tasks: true
        }
      });
    } catch (error) {
      console.error("Error fetching all projects:", error);
      throw new Error("Failed to fetch projects");
    }
};
  

const getProjectById = async ({id}: {id: number}) => {
  try {
      const project = await database.project.findUnique({
          where: { id: id }, // Ensure this matches the primary key field in your Prisma schema
          include: {
              users: {
                  include: {
                      user: true // Ensure this matches the relation field in your Prisma schema
                  }
              },
              tasks: true
          }
      });

      if (!project) {
          throw new Error(`Project with ID not found`);
      }

      return project;
  } catch (error) {
      console.error(`Error fetching project by ID`, error);
      throw new Error(`Failed to fetch project with ID`);
  }
};

const addUserToProject = async (projectId: number, userId: number) => {
  try {
      // Fetch the project
      const project = await database.project.findUnique({
          where: { id: projectId },
          include: { users: true }
      });

      if (!project) {
          throw new Error(`Project with ID ${projectId} not found`);
      }

      // Fetch the user
      const user = await database.user.findUnique({
          where: {id: userId }
      });

      if (!user) {
          throw new Error(`User with ID ${userId} not found`);
      }

        // Update the project with the new user
        await database.project.update({
          where: { id: projectId },
          data: {
              users: {
                  create: {
                      user: {
                          connect: { id: userId }
                      }
                  }
              }
          }
      });
  } catch (error) {
      console.error(`Error adding user to project "${projectId}":`, error);
      throw error;
  }
};
export default {
    createProject,
    getAllProjects,
    getProjectById,
    addUserToProject,
};