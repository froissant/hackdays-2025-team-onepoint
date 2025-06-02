import { ReadStream } from "node:fs";
import { IStorageService } from "./IStorageService";

export class localStorageService implements IStorageService {
    exists(objectName: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    put(objectName: string, body: any, headers: Headers[]): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    get(objectName: string): ReadStream {
        throw new Error("Method not implemented.");
    }
}