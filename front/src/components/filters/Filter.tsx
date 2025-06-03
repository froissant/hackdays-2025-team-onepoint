import { Button } from "@mui/material";

type FilterProps = {
    title: string;
    selected?: boolean;
    onFilterClick?: () => void;
}

export const Filter = ({ title, selected, onFilterClick }: FilterProps) => {
    return (
        <Button
            variant="contained"
            sx={{
                padding: "6px 8px",
                textTransform: "none",
                borderRadius: "4px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: selected ? "#5959DD" : "#C6C6C6",
                backgroundColor: selected ? "#E0E0FF" : "#F0F0F0",
                color: selected ? "#000091" : "#5E5E5E",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "18px", /* 128.571% */
                boxShadow: "none",
            }}
            onClick={onFilterClick}
        >
            {title}
        </Button>
    );
}