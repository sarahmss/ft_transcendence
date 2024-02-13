
import {
	Box,
	Card,
} from "@mui/material";

import { useSignals } from "@preact/signals-react/runtime";
import PromptComponent from "./prompt.component";
import RoomSelectionComponent from "./room_selection.component";
import ChatTabComponent from "./chatTabs.component";

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
				<ChatTabComponent/>

				<RoomSelectionComponent/>
				<PromptComponent/>
			</Box>

		</Card>
	);
};

export default ChatComponent;
