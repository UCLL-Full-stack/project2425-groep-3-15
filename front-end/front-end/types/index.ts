export type Task = {
  TaksId: number;
  name: string;
  description: string;
  dueDate: Date | string;
  completed: boolean;
};

export type User = {
  UserId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export type Project = {
  ProjectId: number;
  name: string;
  tasks: Task[];
  users: User[];
};
