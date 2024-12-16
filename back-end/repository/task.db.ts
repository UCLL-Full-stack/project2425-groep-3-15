import { Task } from '../model/task'; // Assuming Task class is in models folder
import { User } from '../model/user'; // Assuming User class is in models folder
import database from './database'; // Import the database connection

async function createTask(
    name: string,
    description: string | null,
    dueDate: Date,
    completed: boolean,
    users: User[]
) {
    try {
        const task = await database.task.create({
            data: {
                name,
                description, // description can be null
                dueDate: dueDate,
                completed,
                users: {
                    create: users.map((user) => ({
                        user: {
                            connect: { userId: user.id }, // Assuming user object has userId field
                        },
                    })),
                },
            },
            include: {
                users: true, // Include users in the returned task object
            },
        });

        // Transform the Prisma result into the Task domain model
        return task; // Use Task.from() to map to domain model
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

const getAllTasks = async () => {
    try {
        return await database.task.findMany({
            include: {
                users: true, // Include associated users
            },
        });

        // Convert the Prisma result into Task domain models
    } catch (error) {
        console.error('Error fetching all projects:', error);
        throw new Error('Failed to fetch projects');
    }
};

export const getTaskById = async (taskId: number): Promise<Task | null> => {
    try {
        const task = await database.task.findUnique({
            where: { taskId: taskId },
            include: {
                users: true, // Include associated users
            },
        });

        // Convert to Task model if found, else return null
        return task
            ? Task.from({ ...task, users: task.users.map((user) => User.from(user)) })
            : null; // Map Prisma result to Task model
    } catch (error) {
        console.error('Error retrieving task. See server log for details.', error);
        throw error;
    }
};

export const updateTaskStatus = async (taskId: number, completed: boolean) => {
    try {
        const task = await database.task.update({
            where: { taskId },
            data: { completed },
        });
        return task;
    } catch (error) {
        console.error(`Error updating task status:`, error);
        throw new Error('Failed to update task status');
    }
};

export const createTaskForProject = async (
    projectId: number,
    name: string,
    description: string | null,
    dueDate: Date,
    completed: boolean
) => {
    try {
        // Ensure the project exists before creating the task
        const project = await database.project.findUnique({
            where: { projectId },
        });

        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        // Create the task and associate it with the project
        const task = await database.task.create({
            data: {
                name,
                description,
                dueDate,
                completed,
                projectId,
            },
        });

        return task;
    } catch (error) {
        console.error('Error creating task for project:', error);
        throw error;
    }
};

export default {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskStatus,
    createTaskForProject,
};
