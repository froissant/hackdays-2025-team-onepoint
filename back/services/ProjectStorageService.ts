import { FastifyBaseLogger } from "fastify";
import { IProjectStorageService } from "./IProjectStorageService";
import { extname, join } from "path";
import { readdir, readFile, unlink, writeFile, mkdir } from "fs/promises";
import { Project } from "../models/Project";

export class ProjectStorageService implements IProjectStorageService {
    private rootDir: string;
    private logger: FastifyBaseLogger;
    
    constructor(fastifyLogger: FastifyBaseLogger) {
        this.rootDir = process.env.PROJECT_DIR;
        this.logger = fastifyLogger;
    }

    async init(): Promise<void> {
        await mkdir(this.rootDir, { recursive: true })
    }

    async listProjects(): Promise<Project[]> {
        try {
            const files = await readdir(this.rootDir);
            const projects: Project[] = [];
            for(const file of files) {
                if (extname(file) !== '.json') {
                    continue; // Skip non-JSON files
                }
                const projectId = parseInt(file.replace(/project-(\d+)\.json$/g, '$1'));
                const project = await this.load(projectId);
                if (project) {
                    projects.push(project);
                }
            }
            return projects;
        } catch (e) {
            this.logger.error('Error reading project directory:', e);
            return [];
        }
    }
    async save(project: Project): Promise<void> {
        try {
            const filePath = join(this.rootDir, `project-${project.id}.json`);
            await writeFile(filePath, JSON.stringify(project));
        } catch (e) {
            this.logger.error('Error saving project:', e);
        }
    }
    async load(projectId: number): Promise<Project | null> {
        try {
            const filePath = join(this.rootDir, `project-${projectId}.json`);
            const data = await readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            this.logger.error('Error loading project:', e);
            return null;
        }
    }
    async delete(projectId: number): Promise<void> {
        try {
            const filePath = join(this.rootDir, `project-${projectId}.json`);
            await unlink(filePath);
        } catch (e) {
            this.logger.error('Error deleting project:', e);
        }
    }
}