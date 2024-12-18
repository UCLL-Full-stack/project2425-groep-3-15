import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Domain Object Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    beforeEach(async () => {
        // Cleanup: Delete records in correct order to avoid FK constraint errors
        await prisma.userTask.deleteMany();
        await prisma.userProject.deleteMany();
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('should create a User with valid data', async () => {
        const user = await prisma.user.create({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'USER',
            },
        });

        expect(user).toHaveProperty('userId');
        expect(user.email).toBe('john.doe@example.com');
        expect(user.role).toBe('USER');
    });

    test('should not create a User with duplicate email', async () => {
        expect.assertions(1);

        // Create the first user
        await prisma.user.create({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'USER',
            },
        });

        // Attempt to create another user with the same email
        try {
            await prisma.user.create({
                data: {
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'john.doe@example.com', // Duplicate email
                    password: 'password123',
                    role: 'USER',
                },
            });
        } catch (e: any) {
            expect(e.code).toBe('P2002'); // Unique constraint violation
        }
    });
});
