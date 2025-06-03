import { FastifyBaseLogger } from "fastify";
import { IProjectStorageService } from "./IProjectStorageService";
import { IProjectService } from "./IProjectService";


export interface Project {
    id: number;
    title: string;
    updatedAt: Date;
    membersCount: number;
    roomId: string;
    category: "My" | "Shared";
}

// This service is responsible for creating, loading, and deleting projects
// It also handles persistence of project data
export class ProjectService  implements IProjectService {
	getAll() {
		return Array.from(this.projects.values());
	}
    private logger: FastifyBaseLogger;
    private projectStorageService: IProjectStorageService;

    private projects: Map<number, Project>;

    constructor(logger: FastifyBaseLogger, projectStorageService: IProjectStorageService) {
        this.logger = logger;
        this.projectStorageService = projectStorageService;
        this.projects = new Map<number, Project>();
    }

    async listProjects(): Promise<Project[]> {
        return this.projectStorageService.listProjects()
            .then((projectFiles: Project[]) => {
                this.logger.info(`Found ${projectFiles.length} project files: ${projectFiles.join(", ")}`);
                return Promise.all(projectFiles.map(file => this.projectStorageService.load(file.id)))
                    .then(projects => {
                        projects.forEach(project => {
                            if (!project) {
                                this.logger.warn(`Project with 'id' not found in storage`);
                                return;
                            }
                            this.projects.set(project.id, project);
                        });
                        return Array.from(this.projects.values());
                    });
            });
    }
    async create(project: Project): Promise<Project> {
        const id = (+this.projects.size) + 1;
        this.logger.info(`Creating project with 'id': ${id}`);
        project.id = id; // Assign a new ID based on current size
        await this.projectStorageService.save(project);
        this.projects.set(project.id, project);
        return project;
    }
    getById(projectId: string): Promise<Project> {
        this.logger.info(`Getting project by 'id': ${projectId}`);
        return this.projectStorageService.load(parseInt(projectId))
            .then(project => {
                if (project) {
                    this.projects.set(project.id, project);
                    return project;
                } else {
                    throw new Error(`Project with id ${projectId} not found`);
                }
            });
    }
    
    getByRoomIds(roomIds: string[]): Promise<Project> {
        this.logger.info(`Getting project by 'roomIds': ${roomIds.join(", ")}`);
        return this.projectStorageService.listProjects()
            .then((projectFiles: Project[]) => {
                const projects = projectFiles.filter(project => roomIds.includes(project.roomId));
                if (projects.length > 0) {
                    return projects[0]; // Assuming we want the first matching project
                } else {
                    throw new Error(`No project found for room IDs: ${roomIds.join(", ")}`);
                }
            });
    }
    update(project: Project): Promise<void> {
        this.logger.info(`Updating project with 'id': ${project.id}`);
        return this.projectStorageService.save(project)
            .then(() => {
                this.projects.set(project.id, project);
            });
    }
    
    delete(projectId: number): Promise<void> {
        this.logger.info(`Deleting project with 'id': ${projectId}`);
        return this.projectStorageService.delete(projectId)
            .then(() => {
                this.projects.delete(projectId);
            });
    }
}