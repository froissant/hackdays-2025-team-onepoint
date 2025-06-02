import { Grid } from "@mui/material";
import { NewIdeaCard } from "./NewIdeaCard";
import { IdeaCard } from "./IdeaCard";

import { PROJECTS } from "../../assets/projects";

export const ProjectsList = () => {
    return (
        <Grid container columns={4} spacing={2}>
            <Grid size={1}>
                <NewIdeaCard />
            </Grid>

            {PROJECTS.map((project, index) => (
                <Grid size={1}>
                    <IdeaCard key={index} project={project} />
                </Grid>
            ))}
        </Grid>
    );
}
