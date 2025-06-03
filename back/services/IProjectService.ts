import { Project } from "../models/Project";

export interface IProjectService {
    listProjects(): Promise<Project[]>; // List all project files
    create(project: Project): Promise<Project>;
    getById(projectId: string): Promise<Project>;
    getByRoomIds(roomIds: string[]): Promise<Project>;
    update(project: Project): Promise<void>; 
    delete(projectId: number): Promise<void>;
}