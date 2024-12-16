import userDB from '../repository/user.db';
import { User } from '../model/user';
import { UserInput } from '../types';

// Create a new user
async function createUser(input: UserInput): Promise<User> {
    try {
        // Validate user input using the User domain model
        User.validateInput(input);

        const user = new User(input);
        const createdUser = await userDB.createUser(user);

        return createdUser; // Already returns a User domain object
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}

// Fetch all users
async function getAllUsers(): Promise<User[]> {
    try {
        const users = await userDB.getAllUsers();

        // Map raw database objects to User domain objects
        return users.map(User.from);
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error('Failed to fetch users');
    }
}

// Fetch a user by ID
async function getUserById(id: number): Promise<User> {
    try {
        const user = await userDB.getUserById({ id });
        if (!user) throw new Error(`User with ID ${id} not found`);

        return User.from(user);
    } catch (error) {
        console.error(`Error fetching user by ID ${id}:`, error);
        throw new Error('Failed to fetch user');
    }
}

// Fetch a user by email
async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await userDB.getUserByEmail(email);

        // Return null if user not found
        return user ? User.from(user) : null;
    } catch (error) {
        console.error(`Error fetching user by email "${email}":`, error);
        throw new Error('Failed to fetch user by email');
    }
}

export default {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
};
