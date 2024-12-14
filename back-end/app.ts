import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import projectRouter from './controller/project.routes';
import userRouter from './controller/user.routes';
import { expressjwt } from 'express-jwt';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET!;
console.log('Your JWT secret is:', JWT_SECRET);

// Middleware
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

// Routes
app.use('/projects', projectRouter);
app.use('/users', userRouter);

app.use(
    expressjwt({
        secret:
            process.env.JWT_SECRET ||
            'bbae8e42586e9e9b3aabf10c88a0c06006c1039f050070dfceca575e99839961',
        algorithms: ['HS256'], // Match the algorithm used to sign the JWT
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
