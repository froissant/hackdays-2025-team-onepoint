import { useState } from "react";
import { Box, Container } from "@mui/material";
import { FilterBar } from "../../components/filters/FilterBar";
import { ProjectsList } from "../../components/projects/ProjectsList";

function Home() {
    const [selectedFilter, setSelectedFilter] = useState(0);

    return (
        <Container
            sx={{
                marginY: "18px",
            }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <FilterBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
                <ProjectsList selectedFilter={selectedFilter} />
            </Box>
        </Container>
    );
}

export default Home;
