import database from './database';

async function createProject(name: string, description?: string, startDate?: Date, endDate?: Date) {
    try {
        const project = await database.project.create({
            data: {
                name,
            },
        });
        return project;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

const getAllProjects = async () => {
    try {
        return await database.project.findMany({
            include: {
                users: true,
                tasks: true,
            },
        });
    } catch (error) {
        console.error('Error fetching all projects:', error);
        throw new Error('Failed to fetch projects');
    }
};

const getProjectById = async ({ id }: { id: number }) => {
    try {
        const project = await database.project.findUnique({
            where: { projectId: id }, // Ensure this matches the primary key field in your Prisma schema
            include: {
                users: {
                    include: {
                        user: true, // Ensure this matches the relation field in your Prisma schema
                    },
                },
                tasks: true,
            },
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
            where: { projectId: projectId },
            include: { users: true },
        });

        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        // Fetch the user
        const user = await database.user.findUnique({
            where: { userId: userId },
        });

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Update the project with the new user
        await database.project.update({
            where: { projectId: projectId },
            data: {
                users: {
                    create: {
                        user: {
                            connect: { userId: userId },
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error(`Error adding user to project "${projectId}":`, error);
        throw error;
    }
};

const deleteProject = async (projectId: number) => {
    try {
        // Delete related records in the user_projects table
        await database.userProject.deleteMany({
            where: { projectId },
        });

        // Delete related records in the tasks table
        await database.task.deleteMany({
            where: { projectId },
        });

        // Delete the project
        await database.project.delete({
            where: {
                projectId,
            },
        });
    } catch (error) {
        console.error(`Error deleting project with ID ${projectId}:`, error);
        throw error;
    }
};

const updateProjectUsers = async (projectId: number, userIds: number[]) => {
    try {
        // First, clear the existing users from the project
        await database.userProject.deleteMany({
            where: {
                projectId: projectId,
            },
        });

        // Then, add the new users to the project
        await database.userProject.createMany({
            data: userIds.map((userId) => ({
                userId,
                projectId,
            })),
        });
    } catch (error) {
        console.error('Error updating project users:', error);
        throw new Error('Error updating project users');
    }
};
export default {
    createProject,
    getAllProjects,
    getProjectById,
    addUserToProject,
    deleteProject,
    updateProjectUsers,
};
