import { ReadStream } from "node:fs";

export interface IStorageService {
    exists(objectName: string): Promise<boolean>;
    put(objectName: string, body: any, headers: Headers[]): Promise<boolean>;
    get(objectName: string): ReadStream;
}