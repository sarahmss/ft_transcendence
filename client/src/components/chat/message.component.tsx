
import {
	Box,
	Typography,
	Avatar,
	Paper,
} from "@mui/material";

const Message = ({ message }: { message: { id: number; text: string; sender: string } }) => {
	const isCurrentUser = message.sender === "bot";

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: isCurrentUser ? "flex-start" : "flex-end",
				mb: 2,
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: isCurrentUser ? "row" : "row-reverse",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ bgcolor: "secondary.light", color: "white" }}>
					{isCurrentUser ? "B" : "U"}
				</Avatar>
				<Paper
					variant="outlined"
					sx={{
						p: 2,
						ml: isCurrentUser ? 1 : 0,
						mr: isCurrentUser ? 0 : 1,
						backgroundColor: "secondary.light",
						borderRadius: isCurrentUser ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
					}}
				>
					<Typography variant="body2"><b>{message.sender}</b></Typography>
					<Typography variant="body1">{message.text}</Typography>
				</Paper>
			</Box>
		</Box>
	);
};

export default Message;
