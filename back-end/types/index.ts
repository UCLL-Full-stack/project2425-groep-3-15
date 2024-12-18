import { Project } from '../model/project';
import { Task } from '../model/task';
import { User } from '../model/user';

type Role = 'ADMIN' | 'USER' | 'MASTER';

type UserInput = {
    UserId?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    projects?: Project[];
    tasks?: Task[];
};

type ProjectInput = {
    projectId?: number;
    name?: string;
    users?: User[];
    tasks?: Task[];
};

type EnrollmentInput = {
    project: ProjectInput;
    users: UserInput[];
};

type TaskInput = {
    taskId?: number;
    name?: string;
    description?: string | null;
    dueDate?: Date;
    users?: User[];
    completed?: boolean;
};

type AuthenticationResponse = {
    email: string;
    fullname: string;
    role: Role;
};

type TokenPayload = {
    email: string;
};
export {
    Role,
    UserInput,
    ProjectInput,
    TaskInput,
    EnrollmentInput,
    AuthenticationResponse,
    TokenPayload,
};
