/**
 * RoomStorageService
 * 
 * Implementation of the IRoomStorageService interface.
 * This service provides methods to persist and retrieve room snapshots to and from the filesystem.
 * Room data is stored as JSON files in a directory specified by the ROOM_DIR environment variable.
 */

import { RoomSnapshot } from "@tldraw/sync-core";
import { IRoomStorageService } from "./IRoomStorageService";
import { mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { extname, join } from 'path'
import { Readable } from 'stream'
import { FastifyBaseLogger } from "fastify";


export class RoomStorageService implements IRoomStorageService {
    /**
     * The root directory where room data is stored.
     */
    private rootDir: string;
    /**
     * The root asset directory where room assets are stored.
     */
    private rootAssetDir: string;

    private logger: FastifyBaseLogger;
    /**
     * Initializes the RoomStorageService.
     * The root directory is set from the ROOM_DIR environment variable.
     */
    constructor(logger : FastifyBaseLogger) {
        this.rootDir = process.env.ROOM_DIR;
        this.logger = logger;
        this.rootAssetDir = process.env.ASSET_DIR;
    }

    async init(): Promise<void> {
        // Ensure the root directory exists
        await mkdir(this.rootDir, { recursive: true });
        // Ensure the root asset directory exists
        await mkdir(this.rootAssetDir, { recursive: true });
        this.logger.info(`RoomStorageService initialized with root directory: ${this.rootDir}`);
        this.logger.info(`Asset directory initialized at: ${this.rootAssetDir}`);
    }

    /**
     * Lists all JSON files in the room snapshots directory.
     * @returns A promise resolving to an array of room IDs (without the `.json` extension).
     */
    async listRoomFiles(): Promise<string[]> {
        try {
            const files = await readdir(this.rootDir);
            return files
                .filter(file => extname(file) === '.json')
                .map(file => file.replace(/\.json$/, '')); // Remove extension to get roomId
        } catch (e) {
            console.error('Error reading directory:', e);
            return [];
        }
    }

    /**
     * Loads a room snapshot from the filesystem.
     * @param roomId The unique identifier of the room.
     * @returns A promise resolving to the parsed room snapshot object, or undefined if not found or on error.
     */
    async load(roomId: string): Promise<RoomSnapshot | undefined> {
        try {
            const data = await readFile(join(this.rootDir, `${roomId}.json`))
            return JSON.parse(data.toString()) as RoomSnapshot ?? undefined
        } catch (e) {
            return undefined
        }
    }

    /**
     * Saves a room snapshot to the filesystem.
     * Ensures the root directory exists before writing.
     * @param roomId The unique identifier of the room.
     * @param snapshot The RoomSnapshot object to save.
     * @returns A promise that resolves when the operation is complete.
     */
    async save(roomId: string, snapshot: RoomSnapshot): Promise<void> {
        await mkdir(this.rootDir, { recursive: true })
        await writeFile(join(this.rootDir, `${roomId}.json`), JSON.stringify(snapshot))
    }

    /**
     * Saves an asset to the filesystem.
     * Ensures the root asset directory exists before writing.
     * @param id The unique identifier of the asset.
     * @param stream The Readable stream containing the asset data.
     * @returns A promise that resolves when the operation is complete.
     */
    async saveAsset(id: string, stream: Readable) {
        await mkdir(this.rootAssetDir, { recursive: true })
        await writeFile(join(this.rootAssetDir, id), stream)
    }

    /**
     * Loads an asset from the filesystem.
     * @param id The unique identifier of the asset to load.
     * @returns 
     */
    async loadAsset(id: string) : Promise<Buffer> {
        return await readFile(join(this.rootAssetDir, id))
    }
};