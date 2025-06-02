import { Box, Card, Icon, Typography } from "@mui/material";
import CardContent from '@mui/material/CardContent';

import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from "react-router-dom";

export const NewIdeaCard = () => {
    return (
        <Card sx={{
            height: "200px",
            backgroundColor: "primary.main",
            cursor: "pointer",
        }}>
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    color: "white",
                }}>
                <Link
                    to="/draw"
                    state={{ roomName: "test-room" }}
                    style={{
                        textDecoration: 'none',
                        background: 'none'
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Icon>
                            <AddBoxIcon />
                        </Icon>

                        <Typography variant="body1" sx={{ color: 'white' }}>
                            New Ideas Board
                        </Typography>
                    </Box>
                </Link>

            </CardContent>
        </Card>
    );
}
