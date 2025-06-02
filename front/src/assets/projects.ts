export interface Project {
    roomName: string;
    id: number;
    title: string;
    updatedAt: Date;
    membersCount: number;
    category: "My" | "Shared";
}
