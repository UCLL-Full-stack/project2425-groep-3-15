import express, { Request, Response } from 'express';
import projectService from "../service/project.service"
import { ProjectInput, EnrollmentInput } from "../types/index"; 
import prisma from '../repository/database';

export const projectRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         # Add other properties here as per your requirements
 *     ProjectInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         # Add other properties here as needed for creating a project
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve a list of projects
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({ status: 'error', errorMessage: (error as Error).message });
    }
});

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: The created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
projectRouter.post('/', async (req: Request, res: Response) => {
    try {
        const project = <ProjectInput>req.body;
        const result = await projectService.createProject(project); // Ensure the function is awaited
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ status: 'error', errorMessage: (error as Error).message });
    }
});
/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Retrieve a project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID
 *     responses:
 *       200:
 *         description: A single project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
projectRouter.get('/:id', async (req: Request, res: Response) => {
  const project_Id = parseInt(req.params.id);
  if (isNaN(project_Id)) {
    return res.status(400).json({ status: 'error', errorMessage: 'Invalid project ID' });
  }
    
  try {
    const project = await prisma.project.findUnique({
      where: { id: project_Id },
      include: {
        tasks: true,
        users: {
          include: {
            user: true,
          },
        },
      },
    });
    
    if (!project) {
      return res.status(404).json({ status: 'error', errorMessage: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ status: 'error', errorMessage: (error as Error).message });
  }
});        


/**
 * @swagger
 * /projects/{id}/tasks:
 *   post:
 *     summary: Create a new task for a specific project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: The created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRouter.post('/:id/tasks', async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id);
  if (isNaN(projectId)) {
    return res.status(400).json({ status: 'error', errorMessage: 'Invalid project ID' });
  }

  const { name, description, dueDate, completed } = req.body;

  if (!name || !dueDate) {
    return res.status(400).json({ status: 'error', errorMessage: 'Name and due date are required' });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ status: 'error', errorMessage: 'Project not found' });
    }

    const task = await prisma.task.create({
      data: {
        name,
        description,
        dueDate: new Date(dueDate),
        completed: completed !== undefined ? completed : false,
        projectId: projectId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ status: 'error', errorMessage: 'Internal server error' });
  }
});
export default projectRouter;