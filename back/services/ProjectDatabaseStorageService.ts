import { FastifyBaseLogger } from "fastify";
import { Project } from "../models/Project";
import { IProjectStorageService } from "./IProjectStorageService";
import { Database as BetterDatabase } from "better-sqlite3";

export class ProjectDatabaseStorageService implements IProjectStorageService {
    private db: BetterDatabase; // Replace with actual database type
    private logger: FastifyBaseLogger;

    constructor(fastifyLogger: FastifyBaseLogger, db: BetterDatabase) {
        this.logger = fastifyLogger;
        this.db = db;
    }

    async init(): Promise<void> {
        // Initialize database connection if needed
    }

    async listProjects(): Promise<Project[]> {
        try {
            const projects = this.db.prepare<unknown[], Project>('SELECT * FROM projects').all();
            return projects;
        } catch (e) {
            this.logger.error('Error listing projects:', e);
            return [];
        }
    }

    async save(project: Project): Promise<void> {
        try {
            await this.db.prepare<Project, Project>('INSERT INTO projects SET ?').run(project);
        } catch (e) {
            this.logger.error('Error saving project:', e);
        }
    }

    async load(projectId: number): Promise<Project | null> {
        try {
            const project = this.db.prepare<unknown[], Project>('SELECT * FROM projects WHERE id = ?').get([projectId]);
            return project ?? null;
        } catch (e) {
            this.logger.error('Error loading project:', e);
            return null;
        }
    }

    async delete(projectId: number): Promise<void> {
        this.db
            .prepare('DELETE FROM projects WHERE id = @projectId')
            .run({
                "projectId": projectId
            });
    }
}
