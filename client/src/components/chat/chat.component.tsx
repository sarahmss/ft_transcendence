
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

import { messages } from '../../contexts/ChatContext'
import { useSignals } from "@preact/signals-react/runtime";
import PromptComponent from "./prompt.component";

const ChatComponent = () => {
	useSignals();

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

				<PromptComponent/>
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
