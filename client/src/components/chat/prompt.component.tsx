
import * as React from "react";

import {
	Box,
	TextField,
	Button,
	Typography,
	Avatar,
	Grid,
	Paper,
	Select,
	Card
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import authService from "../../services/auth.service";
import messageService from "../../services/chat/message.service";
import { useSignals } from "@preact/signals-react/runtime";

const PromptComponent = () => {
	useSignals();

	const [input, setInput] = React.useState("");

	const handleSend = async () => {
		if (input.trim() !== "") {
			try {

				console.log(authService.getIdFromToken());
				messageService.sendMessage(
					input,
					authService.getIdFromToken(),
					"341c2d88-0e18-466e-a3d9-b829048f4386"
				);
			}

			catch (error) {
				console.log(error);
			}
			setInput("");
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
	};

  return (
		<Box sx={{ p: 2, backgroundColor: "background.default" }}>
			<Grid container spacing={2}>
				<Grid item xs={10}>
					<TextField
						size="small"
						fullWidth
						placeholder="Type a message"
						variant="outlined"
						value={input}
						onChange={handleInputChange}
					/>
				</Grid>

				<Grid item xs={1}>

					<Button
						fullWidth
						variant="contained"
						endIcon={<SendIcon />}
						onClick={handleSend}
						sx={{backgroundColor:"#B700cc"}}
					>
					</Button>
				</Grid>

			</Grid>
		</Box>
  );  
};

export default PromptComponent;
