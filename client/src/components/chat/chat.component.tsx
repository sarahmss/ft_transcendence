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
import roomService from "../../services/chat/room.service";
import messageService from "../../services/chat/message.service";
import { messages } from '../../contexts/ChatContext'
import { useSignals } from "@preact/signals-react/runtime";

const ChatComponent = () => {
	useSignals();
	const [input, setInput] = React.useState("");

	const handleSend = async () => {
		if (input.trim() !== "") {
			try {

				messageService.sendMessage(
					input,
					authService.getIdFromToken(),
					"d17283d5-ffbc-4ac7-8d15-4c6d7ba02692"
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

		<Card sx={{margin:'10px',}}>

			<Box
				sx={{
					height: "125vh",
					display: "flex",
					flexDirection: "column",
					bgcolor: "grey.200",
				}}
			>
				<Box sx={{ flexGrow: 1, overflow: "auto", p: 2, minWidth: 300, maxWidth: 600 }}>
					{messages.value.map((message: any) => (
						<Message key={message.id} message={message} />
					))}
				</Box>

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
								Send
							</Button>
						</Grid>

					</Grid>
				</Box>
			</Box>

		</Card>
	);
};

const Message = ({ message }: { message: { id: number; text: string; sender: string } }) => {
	const isBot = message.sender === "bot";

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: isBot ? "flex-start" : "flex-end",
				mb: 2,
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: isBot ? "row" : "row-reverse",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ bgcolor: "secondary.light", color: "white" }}>
					{isBot ? "B" : "U"}
				</Avatar>
				<Paper
					variant="outlined"
					sx={{
						p: 2,
						ml: isBot ? 1 : 0,
						mr: isBot ? 0 : 1,
						backgroundColor: "secondary.light",
						borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
					}}
				>
					<Typography variant="body1">{message.text}</Typography>
				</Paper>
			</Box>
		</Box>
	);
};

export default ChatComponent;
