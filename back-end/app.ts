import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import projectRouter from './controller/project.routes';
import userRouter from './controller/user.routes';
import { expressjwt } from 'express-jwt';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
dotenv.config();

const app = express();
app.use(helmet());

const port = process.env.APP_PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET!;
app.use(cookieParser());

// Set secure cookie options
app.use((req, res, next) => {
    res.cookie('token', req.cookies.token, {
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === 'production', // Send cookies only over HTTPS in production
        sameSite: 'strict', // Protect against CSRF
    });
    next();
});
// Middleware
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(bodyParser.json());

// Routes
app.use('/projects', projectRouter);
app.use('/users', userRouter);

app.use(
    expressjwt({
        secret: JWT_SECRET,
        algorithms: ['HS256'], // Match the algorithm used to sign the JWT
        getToken: (req) => req.cookies?.token,
    }).unless({
        path: [
            '/users/login', // Allow public routes
            '/users/signup',
            /^\/api-docs/, // Example of excluding Swagger docs
            '/status',
        ],
    })
);

app.get('/status', (req, res) => {
    res.json({ message: 'Project API is running...' });
});

// Swagger setup
const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Projects API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
