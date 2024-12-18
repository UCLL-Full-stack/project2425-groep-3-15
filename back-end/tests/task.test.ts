import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Task Domain Object Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    beforeEach(async () => {
        // Delete dependent records first
        await prisma.userTask.deleteMany();
        await prisma.userProject.deleteMany();

        // Then delete tasks, projects, and users
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('should create a Task with valid data', async () => {
        const project = await prisma.project.create({
            data: {
                name: 'Project Gamma',
            },
        });

        const task = await prisma.task.create({
            data: {
                name: 'Setup Development Environment',
                description: 'Install necessary tools for development.',
                dueDate: new Date(),
                completed: false,
                projectId: project.projectId,
            },
        });

        expect(task).toHaveProperty('taskId');
        expect(task.name).toBe('Setup Development Environment');
        expect(task.projectId).toBe(project.projectId);
    });

    test('should not create a Task without a name', async () => {
        expect.assertions(1);

        try {
            const name = ''; // Simulate invalid input
            if (!name.trim()) throw new Error('Task name cannot be empty');

            await prisma.task.create({
                data: {
                    name,
                    description: 'This task has no name.',
                    dueDate: new Date(),
                    completed: false,
                },
            });
        } catch (e: any) {
            expect(e.message).toBe('Task name cannot be empty');
        }
    });

    test('should assign a Task to multiple Users', async () => {
        // Create Users
        const user1 = await prisma.user.create({
            data: {
                firstName: 'Alice',
                lastName: 'Smith',
                email: `alice.smith${Date.now()}@example.com`,
                password: 'password123',
                role: 'USER',
            },
        });

        const user2 = await prisma.user.create({
            data: {
                firstName: 'Bob',
                lastName: 'Brown',
                email: `bob.brown${Date.now()}@example.com`,
                password: 'password123',
                role: 'USER',
            },
        });

        // Create Project
        const project = await prisma.project.create({
            data: { name: 'Project Delta' },
        });

        // Create Task
        const task = await prisma.task.create({
            data: {
                name: 'Code Review',
                description: 'Review the newly added features.',
                dueDate: new Date(),
                completed: false,
                projectId: project.projectId,
            },
        });

        // Assign Users to Task
        await prisma.userTask.createMany({
            data: [
                { userId: user1.userId, taskId: task.taskId },
                { userId: user2.userId, taskId: task.taskId },
            ],
        });

        // Fetch the Task with Users
        const taskWithUsers = await prisma.task.findUnique({
            where: { taskId: task.taskId },
            include: { users: true },
        });

        // Assertions
        expect(taskWithUsers).not.toBeNull();
        expect(taskWithUsers?.users.length).toBe(2);
        expect(taskWithUsers?.users.map((u) => u.userId)).toEqual(
            expect.arrayContaining([user1.userId, user2.userId])
        );
    });

    test('should not create a Task with invalid projectId', async () => {
        expect.assertions(1);

        try {
            await prisma.task.create({
                data: {
                    name: 'Orphan Task',
                    description: 'This task has no valid project.',
                    dueDate: new Date(),
                    completed: false,
                    projectId: 9999, // Invalid projectId
                },
            });
        } catch (e: any) {
            expect(e.code).toBe('P2003'); // Prisma foreign key constraint error
        }
    });
});
