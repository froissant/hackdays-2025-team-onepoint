import { TLSocketRoom } from '@tldraw/sync-core'
import { FastifyBaseLogger } from 'fastify';
import { RoomState } from '../models/RoomState';
import { IRoomStorageService } from './IRoomStorageService';
import { mkdir } from 'fs';

// This service is responsible for creating, loading, and deleting rooms
// It also handles persistence of room data
export class RoomService {
    private logger: FastifyBaseLogger;
    // TODO: Very simple mutex using promise chaining, to avoid race conditions
    // when loading rooms. In production you probably want one mutex per room
    // to avoid unnecessary blocking!
    private mutex: Promise<null | Error>;

    private rooms: Map<string, RoomState>;

    private storageService: IRoomStorageService;

    /**
     * Initializes the service with a logger.
     * @param logger Fastify logger for logging events.
     */
    // This service is responsible for creating, loading, and deleting rooms
    // It also handles persistence of room data
    constructor(logger: FastifyBaseLogger, storageService: IRoomStorageService) {
        this.logger = logger;
        this.storageService = storageService;
        this.mutex = Promise.resolve(null); // Initialize mutex as resolved promise
        this.rooms = new Map<string, RoomState>();
        // Do persistence on a regular interval.
        // In production you probably want a smarter system with throttling.
        setInterval(this.onTimerTick.bind(this), 2000)
    }

    async init() {
        this.logger.info('RoomService initialized');
        const roomFiles = await this.storageService.listRoomFiles();
        for (const roomFile of roomFiles) {
            // Load each room file and create a room instance
            try {
                await this.makeOrLoadRoom(roomFile);
            } catch (error) {
                this.logger.error(`Failed to load room with 'id': ${roomFile}`, error);
            }
        }
        this.logger.info(`Found ${roomFiles.length} room files: ${roomFiles.join(", ")}`);
    }


    onTimerTick() {
        for (const [roomId, roomState] of this.rooms.entries()) {
            if (roomState.needsPersist) {
                roomState.needsPersist = false
                this.logger.info(`Saving snapshot for room with 'id': ${roomId}`)
                this.storageService.save(roomId, roomState.room.getCurrentSnapshot())
            }

            if (roomState.room.isClosed()) {
                this.deleteRoom(roomId);
            }
        }
    }

    async createRoom(roomId: string): Promise<TLSocketRoom> {
        const self = this;
        self.logger.info(`Creating room with 'id': ${roomId}`)

        const initialSnapshot = await this.storageService.load(roomId)
        const roomState: RoomState = {
            needsPersist: false,
            id: roomId,
            room: new TLSocketRoom({
                initialSnapshot,
                onSessionRemoved(room, args) {
                    self.logger.info(`Client disconnected from room with 'id': ${roomId}`, args.sessionId)
                    if (args.numSessionsRemaining === 0) {
                        self.logger.info(`Closing room with 'id': ${roomId}`)
                        room.close()
                    }
                },
                onDataChange() {
                    roomState.needsPersist = true
                },
            }),
        }

        this.rooms.set(roomId, roomState)
        return roomState.room
    }

    loadRoom(roomId: string): TLSocketRoom | null {
        if (!this.rooms.has(roomId))
            return null;

        const roomState = this.rooms.get(roomId);
        return !roomState || roomState.room.isClosed() ? null : roomState.room;
    }

    deleteRoom(id: string) {
        this.logger.info(`Deleting room with 'id': ${id}`)
        this.rooms.delete(id);
    }

    async makeOrLoadRoom(roomId: string): Promise<TLSocketRoom> {
        this.mutex = this.mutex
            .then(async () => {
                const existingRoom = this.loadRoom(roomId)
                if (existingRoom) {
                    return null // already loaded
                }
                await this.createRoom(roomId)
                return null
            })
            .catch((error) => {
                // return errors as normal values to avoid stopping the mutex chain
                return error
            })

        const err = await this.mutex
        if (err) throw err
        return this.rooms.get(roomId)!.room
    }
}