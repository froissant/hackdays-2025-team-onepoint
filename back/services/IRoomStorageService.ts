import { RoomSnapshot } from "@tldraw/sync-core";
import Stream from "stream";

export interface IRoomStorageService {
    listRoomFiles(): Promise<string[]>;
    load(roomId: string): Promise<RoomSnapshot | undefined>;
    save(roomId: string, room: RoomSnapshot): Promise<void>;
    saveAsset(id: string, stream: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream): Promise<void> ;
}

