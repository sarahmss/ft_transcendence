
import {
	Box,
	Typography,
	Avatar,
	Paper,
} from "@mui/material";
import { Message } from "../../../contexts/ChatContext";
import authService from "../../../services/auth.service";
import { useEffect, useState } from "react";
import userService from "../../../services/user.service";

const MessageComponent = ({ message }: { message: Message }) => {
	const isCurrentUser = message.authorId === authService.getIdFromToken();
	const [profilePic, setProfilePic] = useState('');

	const fetchData = async () => {
		try {
			const picture = await userService.getProfilePicture(message.profileImage, message.authorId);
			setProfilePic(picture);
		  } catch (error) {
			console.error("Error fetching user data:", error);
		  }
	  };
	
	  useEffect(() => {
		fetchData();
	  }, );


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
				<Avatar src={profilePic}/>
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
