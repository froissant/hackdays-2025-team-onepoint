import { TLSocketRoom } from "@tldraw/sync-core"

// We'll keep an in-memory map of rooms and their data
export interface RoomState {
    room: TLSocketRoom<any, void>
    id: string
    needsPersist: boolean
}