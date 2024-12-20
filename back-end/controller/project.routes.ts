import express, { Request, Response } from 'express';
import projectService from '../service/project.service';
import { ProjectInput, EnrollmentInput } from '../types/index';
import prisma from '../repository/database';

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */
export const projectRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         projectId:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     ProjectInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Test Project"
 *         description:
 *           type: string
 *           example: "This is a test project description."
 *     Task:
 *       type: object
 *       properties:
 *         taskId:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         completed:
 *           type: boolean
 *     TaskInput:
 *       type: object
 *       required:
 *         - name
 *         - dueDate
 *       properties:
 *         name:
 *           type: string
 *           example: "Test Task"
 *         description:
 *           type: string
 *           example: "This is a test task description."
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00Z"
 *         completed:
 *           type: boolean
 *           example: false
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve a list of projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
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
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new project
 *     tags: [Projects]
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
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
 *     tags: [Projects]
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
            where: { projectId: project_Id },
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
 *     tags: [Projects]
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
        return res
            .status(400)
            .json({ status: 'error', errorMessage: 'Name and due date are required' });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { projectId: projectId },
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

/**
 * @swagger
 * /projects/tasks/{taskId}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
projectRouter.patch('/tasks/:taskId/status', async (req, res) => {
    const { taskId } = req.params;
    const { completed } = req.body;

    const parsedTaskId = parseInt(taskId, 10);

    if (isNaN(parsedTaskId)) {
        return res.status(400).json({ status: 'error', errorMessage: 'Invalid task ID' });
    }

    if (typeof completed !== 'boolean') {
        return res
            .status(400)
            .json({ status: 'error', errorMessage: 'Completed status must be a boolean' });
    }

    try {
        const task = await prisma.task.update({
            where: { taskId: parsedTaskId },
            data: { completed },
        });

        if (!task) {
            return res.status(404).json({ status: 'error', errorMessage: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ status: 'error', errorMessage: 'Internal server error' });
    }
});

/**
 * @swagger
 * /projects/tasks/{taskId}/status:
 *   put:
 *     summary: Update task status (alternative method)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
projectRouter.put('/tasks/:taskId/status', async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { completed } = req.body;

    const parsedTaskId = parseInt(taskId, 10);

    if (isNaN(parsedTaskId)) {
        return res.status(400).json({ status: 'error', errorMessage: 'Invalid task ID' });
    }

    if (typeof completed !== 'boolean') {
        return res
            .status(400)
            .json({ status: 'error', errorMessage: 'Completed status must be a boolean' });
    }

    try {
        const task = await projectService.updateTaskStatus(parsedTaskId, completed);
        res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ status: 'error', errorMessage: 'Internal server error' });
    }
});

/**
 * @swagger
 * /projects/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID to delete
 *     responses:
 *       200:
 *         description: Deleted task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 */
projectRouter.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const deletedTask = await prisma.task.delete({
            where: { taskId: parseInt(taskId) },
        });
        res.json(deletedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID to delete
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project deleted successfully."
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRouter.delete('/:projectId', async (req: Request, res: Response) => {
    const { projectId } = req.params;

    try {
        await projectService.deleteProject(Number(projectId));
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Error deleting project' });
    }
});

/**
 * @swagger
 * /projects/{projectId}/users:
 *   put:
 *     summary: Update users assigned to a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Project users updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project users updated successfully."
 *       500:
 *         description: Internal server error
 */
projectRouter.put('/:projectId/users', async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { userIds } = req.body;

    try {
        await projectService.updateProjectUsers(Number(projectId), userIds);
        res.status(200).json({ message: 'Project users updated successfully' });
    } catch (error) {
        console.error('Error updating project users:', error);
        res.status(500).json({ error: 'Error updating project users' });
    }
});

export default projectRouter;
