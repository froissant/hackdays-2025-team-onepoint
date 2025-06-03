import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export function MemeToolDialog({ onClose, open }: { onClose(result?: string): void, open: boolean }) {
	const [message, setMessage] = useState("");

	return (
		<>
			<Dialog fullWidth={true} onClose={() => onClose()} open={open}>
				<DialogTitle>Enter a prompt</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						required
						label="Message"
						fullWidth
						variant="standard"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => onClose()}>Cancel</Button>
					<Button type="submit" onClick={() => onClose(message)}>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
