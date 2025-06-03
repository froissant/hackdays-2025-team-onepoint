import { Box, Card, CardActions, CardMedia, Chip, Icon, Tooltip, Typography } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import { formatDistanceToNowStrict } from "date-fns";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from "react-router";

import { BACKEND_URL } from "../../utils/env";
import type { Project } from "../../models/projects";

type IdeaCardProps = {
    project: Project;
}

export const IdeaCard = ({ project }: IdeaCardProps) => {
    if (!project) {
        return null;
    }

    return (
        <Link
            to="/draw"
            state={{ roomName: project.roomId }}>
            <Card sx={{
                cursor: 'pointer',
                textDecoration: 'none', // Prevent underline
                color: 'inherit'         // Keep text color
            }}>

                <CardMedia
                    component="img"
                    height="150"
                    image={BACKEND_URL + `/cdn/previews/${project.roomId}.png`}
                    alt="Idea"
                />
                <CardActions disableSpacing sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{
                        maxWidth: "60%",
                    }}>
                        <Tooltip title={project.title} placement="top" arrow>
                            <Typography component="div"
                                sx={{
                                    color: '#252525',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    lineHeight: "18px",
                                    textWrap: "nowrap",
                                }}>
                                {project.title}
                            </Typography>
                        </Tooltip>
                        <Tooltip title={project.updatedAt.toLocaleString()} placement="bottom" arrow>
                            <Typography color="#777777" sx={{
                                fontSize: '12px',
                                lineHeight: "16px",
                                textWrap: "nowrap",
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                            }}>
                                {formatDistanceToNowStrict(project.updatedAt, { addSuffix: true })}
                            </Typography>
                        </Tooltip>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: "8px" }}>
                        <Chip label={
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                paddingX: "2px",
                                color: "text.primary",
                                padding: 0,
                            }}>
                                <PeopleAltIcon sx={{ width: '16px', height: '16px' }} />
                                {project.membersCount}
                            </Box>
                        } size="small" sx={{ borderRadius: '4px', background: "#EFEFFF", padding: 0 }} />

                        <Icon sx={{ marginY: '0' }}>
                            <MoreHorizIcon />
                        </Icon>
                    </Box>
                </CardActions>
            </Card>
        </Link>
    );
}
