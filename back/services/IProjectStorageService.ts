import { Project } from "../models/Project";
export interface IProjectStorageService {
    listProjects(): Promise<Project[]>; // List all project files
    save(project: Project): Promise<void>; // Save a project by ID
    load(projectId: number): Promise<Project | null>; // Load a project by ID
    delete(projectId: number): Promise<void>; // Delete a project by ID
}