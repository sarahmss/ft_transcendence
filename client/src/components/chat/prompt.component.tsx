
import * as React from "react";

import {
	Box,
	TextField,
	Button,
	Grid,
} from "@mui/material";

import authService from "../../services/auth.service";
import messageService from "../../services/chat/message.service";
import { useSignals } from "@preact/signals-react/runtime";
import { chatData, currentRoom, userLogged } from "../../contexts/ChatContext";

const PromptComponent = () => {

	useSignals();

	const [input, setInput] = React.useState("");

	const send = () => {
		if (input.trim() !== "") {
			try {

				messageService.sendMessage(
					input,
					authService.getIdFromToken(),
					chatData.value[currentRoom.value].roomId
				);
			}

			catch (error) {
				console.log(error);
			}
			setInput("");
		}
	}

	const handleSendEnterDown = (event: any)  => {

		switch (event.key) {
			case "Enter":
				send();
				break;
			default:
				setInput(event.target.value);
		}
	};

	const handleSend = () => {
		send();
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
	};

  return (
		<Box sx={{ p: 2, backgroundColor: "background.default" }}>
			<Grid container spacing={2}>
				<Grid item xs={10}>

					{userLogged.value ?
						(<TextField
							size="small"
							fullWidth
							placeholder="Type a message"
							variant="outlined"
							value={input}
							onChange={handleInputChange}
							onKeyDown={handleSendEnterDown}
						/>) :
						(<TextField
							size="small"
							fullWidth
							placeholder="Please Login first"
							variant="outlined"
							disabled
						/>)
					}

				</Grid>

				<Grid item xs={1}>

					<Button
						variant="contained"
						onClick={handleSend}
						sx={{backgroundColor:"#B700cc"}}
					>
						<b>Send</b>
					</Button>
				</Grid>

			</Grid>
		</Box>
  );  
};

export default PromptComponent;