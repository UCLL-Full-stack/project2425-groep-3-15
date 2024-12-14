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
    check('role').isIn(['ADMIN', 'USER']).withMessage('Invalid role, must be ADMIN or USER'),
];

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
            console.log('Signup - Hashed Password:', hashedPassword);

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
            console.log('Signup - Created User:', user);

            // Respond with the created user's details (excluding sensitive fields)
            res.status(201).json({
                id: user.id,
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

        // Log the incoming request
        console.log('Login Attempt - Email:', email);

        // Find the user by email
        const user = await userService.getUserByEmail(email);
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password Valid:', isPasswordValid); // Debugging password comparison

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const tokenPayload = { email: user.email, role: user.role };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

        // Log the token for debugging
        console.log('Generated Token:', token);

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

export default userRouter;
