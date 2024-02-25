
import {
	Box,
	Card,
    Snackbar,
} from "@mui/material";

import { useSignals } from "@preact/signals-react/runtime";
import PromptComponent from "./prompt.component";
import RoomSelectionComponent from "./room_selection.component";
import ChatTabComponent from "./chatTabs.component";
import { chatError } from "../../contexts/ChatContext";


const ChatComponent = () => {
	useSignals();


	const handleClose = () => {

		chatError.value.open = false;
	}

	return (

		<Card sx={{marginTop:'15px', marginBottom: "15px", marginRight:"15px"}}>

			<Box
				sx={{
					height: "125vh",
					display: "flex",
					flexDirection: "column",
					bgcolor: "grey.200",
					paddingLeft: "0px"
				}}
			>
				<RoomSelectionComponent/>
				<ChatTabComponent/>
				<PromptComponent/>
			</Box>

			<Snackbar
				open={chatError.value.open}
				autoHideDuration={5000}
				onClose={handleClose}
				message={chatError.value.message}
				/>
		</Card>
	);
};

export default ChatComponent;
