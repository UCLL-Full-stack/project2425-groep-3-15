import projectDB from '../repository/project.db';
import { Project } from '../model/project';
import { ProjectInput } from '../types';

async function createProject(input: ProjectInput): Promise<Project> {
    try {
        // Validate input using the Project domain model
        Project.validateInput(input);

        // Delegate creation to the repository
        const createdProject = await projectDB.createProject(input.name!);

        // Map raw repository output to a domain object
        return Project.from(createdProject);
    } catch (error) {
        console.error('Error creating project:', error);
        throw new Error('Failed to create project');
    }
}

async function getAllProjects(): Promise<Project[]> {
    try {
        const projects = await projectDB.getAllProjects();
        return projects.map(Project.from);
    } catch (error) {
        console.error('Error fetching all projects:', error);
        throw new Error('Failed to fetch projects');
    }
}

async function getProjectById(projectId: number): Promise<Project> {
    try {
        const project = await projectDB.getProjectById({ id: projectId });
        if (!project) throw new Error(`Project with ID ${projectId} not found`);

        return Project.from(project);
    } catch (error) {
        console.error(`Error fetching project with ID ${projectId}:`, error);
        throw new Error('Failed to fetch project');
    }
}

async function deleteProject(projectId: number): Promise<void> {
    try {
        await projectDB.deleteProject(projectId);
    } catch (error) {
        console.error(`Error deleting project with ID ${projectId}:`, error);
        throw new Error('Failed to delete project');
    }
}

async function getProjectWithDetails(projectId: number): Promise<Project> {
    const project = await projectDB.getProjectWithDetails(projectId);
    if (!project) throw new Error(`Project with ID ${projectId} not found`);

    return Project.from(project);
}

export default {
    createProject,
    getAllProjects,
    getProjectById,
    deleteProject,
    getProjectWithDetails,
};
