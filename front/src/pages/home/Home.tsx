import { Box } from "@mui/material";
import { FilterBar } from "../../components/filters/FilterBar";
import { ProjectsList } from "../../components/projects/ProjectsList";

function Home() {
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}>
                <FilterBar />
                <ProjectsList />
            </Box>
        </>
    )
}

export default Home;
