import { Box, Button, Card, Icon, Typography } from "@mui/material";
import CardContent from '@mui/material/CardContent';

import AddBoxIcon from '@mui/icons-material/AddBox';
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useState } from "react";
import { useNavigate } from "react-router";

import { BACKEND_URL } from "../../utils/env";

export const NewIdeaCard = () => {

    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const createProject = async (projectName: string) => {
        if (!projectName) {
            setOpenDialog(false);
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/sync/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: projectName,
                    updatedAt: new Date(),
                    membersCount: 1, // Assuming the creator is the first member
                    category: "My", // Default category for new projects
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch projects: ${response.statusText}`);
            }

            const data = await response.json();
            // navigate to the new project page
            // Assuming the response contains the roomId or projectId
            navigate('/draw', {
                state: {
                    roomName: data.roomId, // Adjust this based on your API response
                },
            });
        } catch (error) {
            console.error(error);
        }

        setOpenDialog(false);
    }


    return (<>
        <Button onClick={() => setOpenDialog(true)}
            sx={{
                padding: 0,
                width: "100%"
            }} >

            <Card sx={[{
                height: "200px",
                width: "100%",
                backgroundColor: "primary.main",
                cursor: "pointer",
            },
            {
                '&:hover': {
                    backgroundColor: "primary.dark",
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                }
            }]}>
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        color: "white",
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

                        <Typography variant="body1" sx={{ color: 'white', textTransform: 'none' }}>
                            New Ideas Board
                        </Typography>
                    </Box>

                </CardContent>
            </Card>
        </Button>

        <CreateProjectDialog open={openDialog} onClose={createProject} />
    </>
    );
}
