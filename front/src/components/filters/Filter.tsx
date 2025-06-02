import { Button } from "@mui/material";

type FilterProps = {
    title: string;
    selected?: boolean;
    onFilterClick?: () => void;
}

export const Filter = ({ title, selected, onFilterClick }: FilterProps) => {
    return (
        <Button
            variant={selected ? "contained" : "outlined"}
            sx={{
                textTransform: "none",
            }}
            onClick={onFilterClick}
        >
            {title}
        </Button>
    );
}