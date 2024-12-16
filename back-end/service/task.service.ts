import taskDB from '../repository/task.db';
import { Task } from '../model/task';
import { TaskInput } from '../types';

async function createTask(input: TaskInput): Promise<Task> {
    try {
        // Validate Task input using the domain model
        Task.validateInput(input);

        // Delegate task creation to the repository
        const taskData = await taskDB.createTask(
            input.name!,
            input.description || null,
            input.dueDate!,
            input.completed || false,
            input.users || []
        );

        return Task.from(taskData);
    } catch (error) {
        console.error('Error creating task:', error);
        throw new Error('Failed to create task');
    }
}

async function getAllTasks(): Promise<Task[]> {
    try {
        const tasks = await taskDB.getAllTasks();
        return tasks.map(Task.from);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Failed to fetch tasks');
    }
}

async function getTaskById(taskId: number): Promise<Task> {
    try {
        const task = await taskDB.getTaskById(taskId);
        if (!task) throw new Error(`Task with ID ${taskId} not found`);

        return Task.from(task);
    } catch (error) {
        console.error(`Error fetching task by ID ${taskId}:`, error);
        throw new Error('Failed to fetch task');
    }
}
async function updateTaskStatus(taskId: number, completed: boolean): Promise<Task> {
    try {
        // Delegate to repository to update the task status
        const updatedTask = await taskDB.updateTaskStatus(taskId, completed);

        // Map the raw result to the Task domain object
        return Task.from(updatedTask);
    } catch (error) {
        console.error(`Error updating task status for ID ${taskId}:`, error);
        throw new Error('Failed to update task status');
    }
}

async function createTaskForProject(
    projectId: number,
    input: { name: string; description?: string | null; dueDate: Date; completed?: boolean }
): Promise<Task> {
    try {
        // Validate input using the Task domain model
        Task.validateInput({
            name: input.name,
            dueDate: input.dueDate,
            users: [], // No users are added at task creation in this context
        });

        // Delegate the creation to the repository
        const taskData = await taskDB.createTaskForProject(
            projectId,
            input.name,
            input.description || null,
            input.dueDate,
            input.completed || false
        );

        // Map the raw database result to the Task domain model
        return Task.from(taskData);
    } catch (error) {
        console.error('Error creating task for project:', error);
        throw new Error('Failed to create task for the project');
    }
}

export default {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskStatus,
    createTaskForProject,
};
