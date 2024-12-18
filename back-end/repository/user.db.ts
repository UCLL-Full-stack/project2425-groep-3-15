import { PrismaClient } from '@prisma/client';
import { User } from '../model/user';
import database from './database';
import { Project } from '../model/project';

type UserWithProjects = {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    projects: Project[];
} | null;

const prisma = new PrismaClient();

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                password: user.getPassword(),
                role: user.getRole(),
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('error creating user');
    }
};

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            include: {
                projects: true,
            },
        });
        return usersPrisma.map((user) => User.from(user));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('error fetching users');
    }
};

const getUserById = async ({ id }: { id: number }) => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                userId: id,
            },
            include: {
                projects: true,
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error('Error fetching user by id:', error);
        throw new Error('error fetching user by id');
    }
};
const getUserByEmail = async (email: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return null;
    }

    return new User({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role,
    });
};
const addUserToProject = async (userId: number, projectId: number) => {
    try {
        const userProject = await database.userProject.create({
            data: {
                userId,
                projectId,
            },
        });
        return userProject;
    } catch (error) {
        console.error('Error adding user to project:', error);
        throw new Error('error adding user to project');
    }
};

const getUserProjects = async (userId: number) => {
    try {
        const userWithProjects = await database.user.findUnique({
            where: { userId: userId },
            include: {
                projects: {
                    select: {
                        projectId: true,
                        project: {
                            select: {
                                name: true,
                                _count: {
                                    select: { users: true },
                                },
                            },
                        },
                        // Add other project fields as needed
                    },
                },
            },
        });

        if (!userWithProjects) {
            throw new Error('User not found');
        }

        return userWithProjects.projects.map((project) => ({
            projectId: project.projectId,
            project: {
                name: project.project.name,
                userCount: project.project._count.users,
            },
        }));
    } catch (error) {
        console.error('Error fetching projects for user:', error);
        throw new Error('Error fetching projects for user');
    }
};
export default {
    createUser,
    getAllUsers,
    getUserById,
    addUserToProject,
    getUserByEmail,
    getUserProjects,
};
