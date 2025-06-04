import { Database as BetterDatabase } from "better-sqlite3";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ASSET_DIR: string;
      ROOM_DIR: string;
      PROJECT_DIR: string;
    }
  }
}

declare module 'fastify' {
    interface FastifyInstance {
        database: BetterDatabase
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
