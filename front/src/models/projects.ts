export interface Project {
    roomId: string;
    id: number;
    title: string;
    updatedAt: Date;
    membersCount: number;
    category: "My" | "Shared";
}
