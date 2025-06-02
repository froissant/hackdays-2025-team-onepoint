import { Box } from "@mui/material";
import { Filter } from "./Filter";
import { useState } from "react";

export const FilterBar = () => {
    const filters = ["All Ideas Boards", "My Ideas Boards", "Shared with me"];

    const [selectedFilter, setSelectedFilter] = useState(0);

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
            }}
        >
            {filters.map((filter, index) => (
                <Filter
                    key={index}
                    selected={selectedFilter === index}
                    title={filter}
                    onFilterClick={() => setSelectedFilter(index)}
                />
            ))}
        </Box>
    );
};
