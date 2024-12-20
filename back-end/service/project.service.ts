import { PrismaClient } from '@prisma/client';
import { ProjectInput } from '../types';
import projectDB from '../repository/project.db';

const prisma = new PrismaClient();

async function createProject(data: ProjectInput) {
    try {
        // Check for duplicate project name
        const existingProject = await prisma.project.findFirst({
            where: { name: data.name! },
        });

        if (existingProject) {
            throw new Error(`Project with name "${data.name}" already exists`);
        }

        // Create the project if no duplicate
        if (!data.name) {
            throw new Error('Project name is required');
        }

        const project = await prisma.project.create({
            data: {
                name: data.name,
                users: {
                    connect: [],
                },
                tasks: {
                    connect: [],
                },
            },
        });

        return project;
    } catch (error) {
        console.error('Error creating project:', error);
        throw new Error('Failed to create project');
    }
}

async function getAllProjects() {
    try {
        return await prisma.project.findMany({
            include: {
                users: true,
                tasks: true,
            },
        });
    } catch (error) {
        console.error('Error fetching all projects:', error);
        throw new Error('Failed to fetch projects');
    }
}

async function getProjectById(projectId: number) {
    try {
        const project = await prisma.project.findUnique({
            where: { projectId: projectId },
            include: {
                users: true,
                tasks: true,
            },
        });

        if (!project) {
            throw new Error(`Project with ID "${projectId}" not found`);
        }

        return project;
    } catch (error) {
        console.error(`Error fetching project by ID "${projectId}":`, error);
        throw new Error(`Failed to fetch project with ID "${projectId}"`);
    }
}

const deleteProject = async (projectId: number) => {
    return await projectDB.deleteProject(projectId);
};

async function updateTaskStatus(taskId: number, completed: boolean) {
    const task = await prisma.task.update({
        where: { taskId },
        data: { completed },
    });

    if (!task) {
        throw new Error('Task not found');
    }

    return task;
}

const updateProjectUsers = async (projectId: number, userIds: number[]) => {
    return await projectDB.updateProjectUsers(projectId, userIds);
};

export default {
    createProject,
    getAllProjects,
    getProjectById,
    deleteProject,
    updateTaskStatus,
    updateProjectUsers,
};
