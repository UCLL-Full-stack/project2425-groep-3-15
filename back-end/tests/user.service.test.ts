import userService from '../service/user.service';
import userDB from '../repository/user.db';
import { User } from '../model/user';
import { Role } from '@prisma/client';

jest.mock('../repository/user.db');

describe('User Service Tests', () => {
    const mockUser = new User({
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'hashedPassword',
        role: Role.USER,
        projects: [],
        tasks: [],
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a new user', async () => {
        const userInput = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@test.com',
            password: 'hashedPassword',
            role: Role.USER,
        };

        (userDB.getUserByEmail as jest.Mock).mockResolvedValue(null);
        (userDB.createUser as jest.Mock).mockResolvedValue(mockUser);

        const result = await userService.createUser(userInput);

        expect(result).toEqual(mockUser);
        expect(userDB.getUserByEmail).toHaveBeenCalledWith(userInput.email);
        expect(userDB.createUser).toHaveBeenCalledWith(expect.any(User));
    });

    test('should throw an error if user already exists', async () => {
        const userInput = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@test.com',
            password: 'hashedPassword',
            role: Role.USER,
        };

        (userDB.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

        await expect(userService.createUser(userInput)).rejects.toThrow('User already exists');

        expect(userDB.getUserByEmail).toHaveBeenCalledWith(userInput.email);
        expect(userDB.createUser).not.toHaveBeenCalled();
    });

    test('should get all users', async () => {
        const users = [mockUser];

        (userDB.getAllUsers as jest.Mock).mockResolvedValue(users);

        const result = await userService.getAllUsers();

        expect(result).toEqual(users);
        expect(userDB.getAllUsers).toHaveBeenCalledTimes(1);
    });

    test('should get user by ID', async () => {
        const userId = 1;

        (userDB.getUserById as jest.Mock).mockResolvedValue(mockUser);

        const result = await userService.getUserById({ id: userId });

        expect(result).toEqual(mockUser);
        expect(userDB.getUserById).toHaveBeenCalledWith({ id: userId });
    });

    test('should get user by email', async () => {
        const email = 'john.doe@test.com';

        (userDB.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

        const result = await userService.getUserByEmail(email);

        expect(result).toEqual(mockUser);
        expect(userDB.getUserByEmail).toHaveBeenCalledWith(email);
    });
});
