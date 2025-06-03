import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useId, useState } from "react";

export function CreateProjectDialog({ onClose, open }: { onClose(result?: string): void, open: boolean }) {
    const [projectName, setProjectName] = useState("");
    const id = useId();

    const handleCreate = () => {
        if (projectName.trim() === "") {
            return;
        }
        onClose(projectName);
        setProjectName("");
    };

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id={id}
                    label="Project Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleCreate} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
