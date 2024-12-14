import { User } from '../model/user';
import { UserInput, AuthenticationResponse } from '../types';
import bcrypt from 'bcrypt';
import userDB from '../repository/user.db';

const createUser = async ({
    firstName,
    lastName,
    email,
    password,
    role,
}: UserInput): Promise<User> => {
    // Check if the user already exists
    const existingUser = await userDB.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Create the user
    const user = new User({ firstName, lastName, email, password: password, role });
    return await userDB.createUser(user);
};

const getAllUsers = async (): Promise<User[]> => {
    return await userDB.getAllUsers();
};

const getUserById = async ({ id }: { id: number }) => {
    return await userDB.getUserById({ id });
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    return await userDB.getUserByEmail(email);
};

export default { createUser, getAllUsers, getUserById, getUserByEmail };
