import { PrismaClient } from '@prisma/client';
import { Role } from '@prisma/client';

const database = new PrismaClient();

async function main() {
  // Delete existing data
  await database.userProject.deleteMany();
  await database.userTask.deleteMany();
  await database.user.deleteMany();
  await database.task.deleteMany();
  await database.project.deleteMany();

  // Seed Users
  const user1 = await database.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: Role.ADMIN,
    },
  });

  const user2 = await database.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'password456',
      role: Role.USER,
    },
  });

  // Seed Projects
  const project1 = await database.project.create({
    data: {
      name: 'Project 1',
    },
  });

  const project2 = await database.project.create({
    data: {
      name: 'Project 2',
    },
  });

  console.log('Seeded projects:', { project1, project2 });

  // Seed Tasks
  const task1 = await database.task.create({
    data: {
      name: 'Task 1',
      description: 'Description for task 1',
      dueDate: new Date(),
      completed: false,
      projectId: project1.id, // Assign task to project1
    },
  });

  const task2 = await database.task.create({
    data: {
      name: 'Task 2',
      description: 'Description for task 2',
      dueDate: new Date(),
      completed: false,
      projectId: project2.id, // Assign task to project2
    },
  });

  console.log('Seeded tasks:', { task1, task2 });

  // Seed User-Project Relations
  await database.userProject.create({
    data: {
      userId: user1.id,
      projectId: project1.id,
    },
  });

  await database.userProject.create({
    data: {
      userId: user2.id,
      projectId: project2.id,
    },
  });

  // Seed User-Task Relations
  await database.userTask.create({
    data: {
      userId: user1.id,
      taskId: task1.id,
    },
  });

  await database.userTask.create({
    data: {
      userId: user2.id,
      taskId: task2.id,
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