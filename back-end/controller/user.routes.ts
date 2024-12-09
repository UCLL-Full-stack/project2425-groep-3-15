import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { Router } from 'express';
import { UserInput } from '../types';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});
/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Retrieve a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's email
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *       404:
 *         description: User not found
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
userRouter.get('/email/:email', async (req: Request, res: Response) => {
    const email = req.params.email;

    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ status: 'error', errorMessage: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

