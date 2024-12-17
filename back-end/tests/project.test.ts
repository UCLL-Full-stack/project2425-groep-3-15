import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Project Domain Object Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    beforeEach(async () => {
        // Cleanup: Delete records in the correct order to avoid FK constraint errors
        await prisma.userTask.deleteMany();
        await prisma.userProject.deleteMany();
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('should create a Project with valid data', async () => {
        const project = await prisma.project.create({
            data: {
                name: 'Project Alpha',
            },
        });

        expect(project).toHaveProperty('projectId');
        expect(project.name).toBe('Project Alpha');
    });

    test('should not create a Project with duplicate name', async () => {
        expect.assertions(1);

        // Create the first project
        await prisma.project.create({
            data: {
                name: 'Project Alpha',
            },
        });

        // Attempt to create another project with the same name
        try {
            await prisma.project.create({
                data: {
                    name: 'Project Alpha', // Duplicate name
                },
            });
        } catch (e: any) {
            expect(e.code).toBe('P2002'); // Unique constraint violation
        }
    });

    test('should create a Project and assign Users via UserProject', async () => {
        // Create a User
        const user = await prisma.user.create({
            data: {
                firstName: 'Jane',
                lastName: 'Doe',
                email: `jane.doe${Date.now()}@example.com`,
                password: 'password123',
                role: 'USER',
            },
        });

        // Create a Project
        const project = await prisma.project.create({
            data: {
                name: 'Project Beta',
                users: {
                    create: [
                        {
                            user: {
                                connect: { userId: user.userId },
                            },
                        },
                    ],
                },
            },
            include: {
                users: true,
            },
        });

        expect(project).toHaveProperty('projectId');
        expect(project.name).toBe('Project Beta');
        expect(project.users.length).toBe(1);
        expect(project.users[0].userId).toBe(user.userId);
    });
});
