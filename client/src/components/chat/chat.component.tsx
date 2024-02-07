import * as React from "react";
import axios from 'axios';

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

import { ChatLink, MessagePostLink } from "../../common/constants";

import socketClient from 'socket.io-client';
import AuthService from "../../services/auth.service";

const messagesByRoom: any = {};

const messages = [
	{ id: 1, text: "Hi there!", sender: "bot" },
	{ id: 2, text: "Hello!", sender: "user" },
	{ id: 3, text: "How can I assist you today?", sender: "bot" },
];

const chatSocket = socketClient(ChatLink, {
  autoConnect: true,
  transports: ['websocket'],
  withCredentials: true,
});

const ChatComponent = () => {
	const [input, setInput] = React.useState("");

	const handleSend = async () => {
		if (input.trim() !== "") {
			try {

				// console.log(messagesByRoom);
				// if (!messagesByRoom["something"])
				// 	messagesByRoom["something"] = [];
				// else
				// 	messagesByRoom["something"].push("woah");
				// console.log(messagesByRoom);
				console.log(AuthService.getIdFromToken());
				// const data = {

				//     message: {
				// 			userId: "51fb1552-79bb-447e-9eed-1c8bdca2a9f9",
    //           roomId: "38e32c2f-f266-45b4-8a58-8cb799d7ce3c" ,
    //           message: "something!"
				// 		}
				// }

				// const res = await axios.post(
				// 	MessagePostLink,
				// 	data,
				// 	{ headers: AuthService.getAuthToken()}
				// );
				// console.log(res);
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
					{messages.map((message) => (
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
