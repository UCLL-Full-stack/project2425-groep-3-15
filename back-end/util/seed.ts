import { PrismaClient } from '@prisma/client';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const database = new PrismaClient();

async function main() {
    // Delete existing data
    await database.userProject.deleteMany();
    await database.userTask.deleteMany();
    await database.user.deleteMany();
    await database.task.deleteMany();
    await database.project.deleteMany();

    // Seed Users
    const admin = await database.user.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.admin@example.com',
            password: await bcrypt.hash('admin123?', 10),
            role: Role.ADMIN,
        },
    });

    const user = await database.user.create({
        data: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.user@example.com',
            password: await bcrypt.hash('user123?', 10),
            role: Role.USER,
        },
    });

    const master = await database.user.create({
        data: {
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice.master@example.com',
            password: await bcrypt.hash('master123?', 10),
            role: Role.MASTER,
        },
    });

    const normalUser1 = await database.user.create({
        data: {
            firstName: 'Bob',
            lastName: 'Williams',
            email: 'bob.williams@example.com',
            password: await bcrypt.hash('user123?', 10),
            role: Role.USER,
        },
    });

    const normalUser2 = await database.user.create({
        data: {
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@example.com',
            password: await bcrypt.hash('user123?', 10),
            role: Role.USER,
        },
    });

    // Seed Projects
    const workplaceproject = await database.project.create({
        data: {
            name: 'Workplaceproject',
        },
    });

    const fullstackproject = await database.project.create({
        data: {
            name: 'Fullstackproject',
        },
    });

    const examensToDo = await database.project.create({
        data: {
            name: 'ExamensToDo',
        },
    });

    // Seed Tasks for Workplaceproject (Agile related)
    const agileTasks = [
        {
            name: 'Sprint Planning',
            description: 'Plan the tasks for the upcoming sprint',
            dueDate: new Date(),
        },
        {
            name: 'Daily Standup',
            description: 'Daily team meeting to discuss progress and blockers',
            dueDate: new Date(),
        },
        {
            name: 'Sprint Review',
            description: 'Review the work completed during the sprint',
            dueDate: new Date(),
        },
        {
            name: 'Retrospective',
            description: 'Reflect on the sprint and identify improvements',
            dueDate: new Date(),
        },
    ];

    for (const task of agileTasks) {
        await database.task.create({
            data: {
                ...task,
                completed: false,
                projectId: workplaceproject.projectId,
            },
        });
    }

    // Seed Tasks for Fullstackproject
    const fullstackTasks = [
        {
            name: 'Setup TypeScript',
            description: 'Initialize TypeScript in the project and configure tsconfig',
            dueDate: new Date(),
        },
        {
            name: 'Build React Components',
            description: 'Create reusable React components for the project',
            dueDate: new Date(),
        },
        {
            name: 'Integrate API',
            description: 'Connect the front-end with the back-end API',
            dueDate: new Date(),
        },
        {
            name: 'Deploy Application',
            description: 'Deploy the application to a hosting service',
            dueDate: new Date(),
        },
    ];

    for (const task of fullstackTasks) {
        await database.task.create({
            data: {
                ...task,
                completed: false,
                projectId: fullstackproject.projectId,
            },
        });
    }

    // Seed Tasks for ExamensToDo
    const examTasks = [
        {
            name: 'Study Data Structures',
            description: 'Review trees, graphs, and algorithms',
            dueDate: new Date(),
        },
        {
            name: 'Prepare for Database Exam',
            description: 'Study normalization and SQL queries',
            dueDate: new Date(),
        },
        {
            name: 'Review Operating Systems',
            description: 'Go through process scheduling and memory management',
            dueDate: new Date(),
        },
        {
            name: 'Practice Mock Tests',
            description: 'Attempt past papers and mock tests for exams',
            dueDate: new Date(),
        },
    ];

    for (const task of examTasks) {
        await database.task.create({
            data: {
                ...task,
                completed: false,
                projectId: examensToDo.projectId,
            },
        });
    }

    // Assign Users to Projects
    await database.userProject.create({
        data: {
            userId: admin.userId,
            projectId: workplaceproject.projectId,
        },
    });

    await database.userProject.create({
        data: {
            userId: user.userId,
            projectId: fullstackproject.projectId,
        },
    });

    await database.userProject.create({
        data: {
            userId: master.userId,
            projectId: examensToDo.projectId,
        },
    });

    await database.userProject.create({
        data: {
            userId: normalUser1.userId,
            projectId: workplaceproject.projectId,
        },
    });

    await database.userProject.create({
        data: {
            userId: normalUser2.userId,
            projectId: fullstackproject.projectId,
        },
    });
}

main()
    .then(() => {
        console.log('Seeding completed successfully');
    })
    .catch((e) => {
        console.error('Error during seeding:', e);
    })
    .finally(async () => {
        await database.$disconnect();
    });
