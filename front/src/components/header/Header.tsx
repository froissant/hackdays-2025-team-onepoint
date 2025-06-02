import { Gaufre } from "@gouvfr-lasuite/integration"
import { Box, Chip, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingX: "18px",
                paddingY: "10px",
                borderBottom: '1px solid #E2E2E2',
            }}>
            <Link to="/" style={{ textDecoration: 'none', background: 'none' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: "4px",
                    }}>
                    <img
                        src="/logo.svg"
                        alt="Logo"
                        loading="lazy"
                        height={32}
                        width={32}
                    />
                    <Typography variant="h4" component="h2">
                        Ideas
                    </Typography>
                    <Chip sx={{
                        backgroundColor: "#FBDBDD",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "4px 6px",
                        gap: "6px",
                        boxSizing: "content-box",
                        maxHeight: "16px",
                        '& .MuiChip-label': {
                            paddingX: "6px",
                            paddingY: "4px",
                        },

                    }}
                        label={
                            <img
                                src="/alpha.svg"
                                width={8}
                                height={8}
                            />
                        } />
                </Box>
            </Link>

            <Gaufre variant="small" />
        </Box >
    );
};
