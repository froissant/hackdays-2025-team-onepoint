
export interface Project {
    id: number;
    title: string;
    updatedAt: Date;
    membersCount: number;
    roomId: string;
    category: "My" | "Shared";
}
