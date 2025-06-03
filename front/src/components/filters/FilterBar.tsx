import { Box } from "@mui/material";
import { Filter } from "./Filter";


export interface FilterBarProps {
    selectedFilter: number;
    setSelectedFilter: (filter: number) => void;
}


export const FilterBar = ({ selectedFilter, setSelectedFilter }: FilterBarProps) => {
    const filters = ["All Ideas Boards", "My Ideas Boards", "Shared with me"];

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                height: "32px",
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
