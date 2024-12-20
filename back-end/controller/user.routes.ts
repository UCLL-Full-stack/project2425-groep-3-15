import express, { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import userService from '../service/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationResponse, UserInput } from '../types';

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

const validateSignup = [
    check('email')
        .isEmail()
        .withMessage('Invalid email format')
        .notEmpty()
        .withMessage('Email is required'),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('role')
        .isIn(['ADMIN', 'USER', 'MASTER'])
        .withMessage('Invalid role, must be ADMIN, MASTER or USER'),
];
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Sign up a new user
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
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 role:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
userRouter.post(
    '/signup',
    validateSignup,
    async (req: Request, res: Response, next: NextFunction) => {
        // Validate the incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { firstName, lastName, email, password, role }: UserInput = req.body;

            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(password, 10);

            // Prepare the user input for the service
            const userInput: UserInput = {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
            };

            // Create the user
            const user = await userService.createUser(userInput);

            // Respond with the created user's details (excluding sensitive fields)
            res.status(201).json({
                id: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            });
        } catch (error) {
            next(error);
        }
    }
);

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: { email: string; password: string } = req.body;

        // Find the user by email
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const tokenPayload = { email: user.email, role: user.role };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

        // Set the token as an HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // Protects against CSRF
            maxAge: 3600 * 1000, // 1 hour
        });

        // Respond with user details
        res.status(200).json({
            email: user.email,
            fullname: `${user.firstName} ${user.lastName}`,
            role: user.role,
        });
    } catch (error) {
        console.error('Login Error:', error);
        next(error);
    }
});
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
userRouter.post('/logout', (req: Request, res: Response) => {
    // Clear the token cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
    });

    // Respond with a success message
    res.status(200).json({ message: 'Logged out successfully' });
});
/**
 * @swagger
 * /users/{userId}/projects:
 *   get:
 *     summary: Get projects for a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of projects for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching projects for user
 */
userRouter.get('/:userId/projects', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const userWithProjects = await userService.getUserProjects(userId);

        if (!userWithProjects) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userWithProjects); // No TypeScript errors here
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects for user' });
    }
});

export default userRouter;
