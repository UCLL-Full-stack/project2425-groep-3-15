import { TaskInput } from '../types';
import { User } from './user';
import { Task as prismaTask } from '@prisma/client';

export class Task {
    readonly taskId: number;
    readonly name: string;
    readonly description: string | null; // Allow description to be nullable
    readonly dueDate: Date;
    readonly completed: boolean;
    readonly users: User[];

    constructor(task: {
        taskId: number;
        name: string;
        description: string | null; // description is now nullable
        dueDate: Date;
        completed: boolean;
        users: User[];
    }) {
        this.validate(task);
        this.taskId = task.taskId;
        this.name = task.name;
        this.description = task.description ?? null; // Default to null if no description
        this.dueDate = task.dueDate;
        this.completed = task.completed;
        this.users = task.users || [];
    }

    static from(prismaTask: any): Task {
        return new Task({
            taskId: prismaTask.taskId,
            name: prismaTask.name,
            description: prismaTask.description ?? null, // description can be null here
            dueDate: prismaTask.dueDate,
            completed: prismaTask.completed,
            users: prismaTask.users?.map((user: any) => User.from(user)) || [],
        });
    }

    private validate(task: {
        taskId: number;
        name: string;
        description: string | null;
        dueDate: Date;
        users: User[];
    }) {
        if (!task.name) {
            throw new Error('Task name is required');
        }
        if (!(task.dueDate instanceof Date)) {
            throw new Error('Due date must be a valid date');
        }
    }

    public getTaskId(): number | undefined {
        return this.taskId;
    }

    public getName(): string {
        return this.name;
    }

    public getDueDate(): Date {
        return this.dueDate;
    }

    public getUsers(): User[] {
        return this.users;
    }

    public getCompleted(): boolean {
        return this.completed;
    }

    equals(task: Task): boolean {
        return (
            this.taskId === task.getTaskId() &&
            this.name === task.getName() &&
            this.dueDate === task.getDueDate() &&
            this.users === task.getUsers() &&
            this.completed === task.getCompleted()
        );
    }

    addUserToTask(user: User) {
        if (!this.users.find((existingUser) => existingUser.id === user.id)) {
            this.users.push(user);
        }
    }

    static validateInput(input: TaskInput) {
        if (!input.name || input.name.trim() === '') {
            throw new Error('Task name is required');
        }
        if (!input.dueDate || !(input.dueDate instanceof Date)) {
            throw new Error('Valid due date is required');
        }
    }
}
