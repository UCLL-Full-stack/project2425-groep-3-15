import { User } from "../model/user";
import { UserInput, AuthenticationResponse } from "../types";
import { generateToken } from '../util/jwt';
import bcrypt from 'bcrypt';
import userDB from "../repository/user.db";

const authenticate = async ({ email, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await getUserByEmail( email );

    if (!user) {
        throw new Error('User not found.');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }

    return {
        token: generateToken({email}), // Generate and return a valid token here
        email: email,
        fullname: `${user.getFirstName()} ${user.getLastName()}`,
    };
};

const createUser = async ({ firstName, lastName, email, password, role }: UserInput): Promise<User> => {
    // Check if the user already exists
    const existingUser = await userDB.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = new User({ firstName, lastName, email, password: hashedPassword, role });
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

export default { createUser, getAllUsers, getUserById, getUserByEmail, authenticate };