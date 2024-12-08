import { PrismaClient } from '@prisma/client';
import { User } from "../model/user";
import database from "./database";

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
        console.error("Error creating user:", error);
        throw new Error("error creating user");
    }
};

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            include: {
                projects: true,
            }
        });
        return usersPrisma.map(user => User.from(user));
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("error fetching users");
    }
};

const getUserById = async ({ id }: { id: number }) => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                id: id            },
            include: {
                projects: true,
            }
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error("Error fetching user by id:", error);
        throw new Error("error fetching user by id");
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
        id: user.id,
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
                projectId
            }
        });
        return userProject;
    } catch (error) {
        console.error("Error adding user to project:", error);
        throw new Error("error adding user to project");
    }
};

export default {
    createUser,
    getAllUsers,
    getUserById,
    addUserToProject,
    getUserByEmail
};
