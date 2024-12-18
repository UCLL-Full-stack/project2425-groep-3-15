import { User } from './user';
import { Task } from './task';

export class Project {
    readonly projectId?: number;
    readonly name: string;
    readonly tasks: Task[] = [];
    readonly users: User[] = [];

    constructor(project: { projectId?: number; name: string; tasks?: Task[]; users?: User[] }) {
        this.projectId = project.projectId;
        this.name = project.name;
        this.tasks = project.tasks || [];
        this.users = project.users || [];
    }

    static from(projectPrisma: any): Project {
        return new Project({
            projectId: projectPrisma.projectId,
            name: projectPrisma.name,
            tasks: projectPrisma.tasks?.map(Task.from) || [],
            users: projectPrisma.users?.map(User.from) || [],
        });
    }

    public getProjectId(): number | undefined {
        return this.projectId;
    }

    public getName(): string {
        return this.name;
    }

    public getUsers(): User[] {
        return this.users;
    }

    public getTasks(): Task[] {
        return this.tasks;
    }

    equals(project: Project): boolean {
        return (
            this.projectId === project.getProjectId() &&
            this.name === project.getName() &&
            this.users === project.getUsers() &&
            this.tasks === project.getTasks()
        );
    }
}
