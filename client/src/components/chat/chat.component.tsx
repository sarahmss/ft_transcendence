
import {
	Box,
	Card,
    Tab,
    Tabs
} from "@mui/material";

import { messages } from '../../contexts/ChatContext'
import { useSignals } from "@preact/signals-react/runtime";
import PromptComponent from "./prompt.component";
import RoomSelectionComponent from "./room_selection.component";
import Message from "./message.component";
import ChatTabComponent from "./chatTabs.component";

const ChatComponent = () => {
	useSignals();

	return (

		<Card sx={{margin:'10px',}}>

			<ChatTabComponent/>

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

				<RoomSelectionComponent/>
				<PromptComponent/>
			</Box>

		</Card>
	);
};


export default ChatComponent;
