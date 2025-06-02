import { RoomSnapshot } from "@tldraw/sync-core";

export interface IRoomStorageService {
    load(roomId: string): Promise<any>;
    save(roomId: string, room: RoomSnapshot): Promise<void>;
}

