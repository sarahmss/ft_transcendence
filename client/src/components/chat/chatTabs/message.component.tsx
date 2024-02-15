
import {
	Box,
	Typography,
	Avatar,
	Paper,
} from "@mui/material";
import { Message } from "../../../contexts/ChatContext";
import authService from "../../../services/auth.service";

const MessageComponent = ({ message }: { message: Message }) => {
	const isCurrentUser = message.authorId === authService.getIdFromToken();

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
				<Avatar src={message.profileImage}/>
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
					<Typography sx={{maxWidth: "200px", wordWrap: "break-word"}} variant="body2">
						<b>{message.author}</b>
					</Typography>

					<Typography sx={{maxWidth: "200px", wordWrap: "break-word"}} variant="body1">
						{message.message}
					</Typography>

				</Paper>
			</Box>
		</Box>
	);
};

export default MessageComponent;
