import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import projectRouter from './controller/project.routes';
import { userRouter } from './controller/user.routes';
import express, { NextFunction, Request, Response } from 'express';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

// Routes
app.use('/projects', projectRouter);
app.use('/users', userRouter);

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

app.use('api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((err: Error, reg: Request, res: Response, next: NextFunction) => {
    res.status(400).json({status: "application error", message: err.message})
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});