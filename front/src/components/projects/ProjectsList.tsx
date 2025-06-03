import { Grid } from "@mui/material";
import { NewIdeaCard } from "./NewIdeaCard";
import { IdeaCard } from "./IdeaCard";

import type { Project } from "../../assets/projects";
import { useEffect, useState } from "react";

// Define the props interface
interface ProjectsListProps {
    selectedFilter: number; // 0 = All, 1 = My Ideas Boards, 2 = Shared with me
}

export const ProjectsList = ({ selectedFilter }: ProjectsListProps) => {
    const [rooms, setRooms] = useState<Project[]>([]);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sync/projects`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch projects: ${response.statusText}`);
            }

            const data = await response.json();
            setRooms(data);
        } catch {
            setRooms([]);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Apply filtering logic
    const filteredRooms = rooms.filter((project) => {
        if (selectedFilter === 1) return project.category === "My";
        if (selectedFilter === 2) return project.category === "Shared";
        return true; // 0 = All
    });

    return (
        <Grid container columns={4} spacing={2}>
            <Grid key={"new-idea-card-grid"} size={1}>
                <NewIdeaCard key={"new-idea-card"} />
            </Grid>

            {filteredRooms.map((project) => (
                <Grid size={1} key={project.roomName + "-grid"}>
                    <IdeaCard key={project.roomName + "-idea"} project={project} />
                </Grid>
            ))}
        </Grid>
    );
};
