
import * as React from "react";
import SendIcon from '@mui/icons-material/Send';
import {
	Box,
	TextField,
	Button,
	Grid
} from "@mui/material";
import authService from "../../services/auth.service";
import messageService from "../../services/chat/message.service";
import { useSignals } from "@preact/signals-react/runtime";
import { chatData, currentRoom, userLogged } from "../../contexts/ChatContext";

import {useSelector, useDispatch} from "react-redux";
import {addUser, userLog} from "../../services/reduce";

const PromptComponent = () => {

	useSignals();
	let users = useSelector(userLog);
	const dispatch = useDispatch();

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
				dispatch(addUser("Sendmessage"));
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

					{userLogged.value && currentRoom.value > -1 ?
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
							value={input}
							placeholder="Please Select a room first"
							variant="outlined"
							disabled							
						/>)
					}

				</Grid>

				<Grid item xs={1} >
					<Box sx={{marginRight:"10px"}}>
						{userLogged.value && currentRoom.value > -1 ?
							(
								<Button
									variant="contained"
									onClick={handleSend}
									sx={{backgroundColor:"#B700cc"}}
								>
									<SendIcon/>
								</Button>
							
							) :
							(
								<Button
									variant="contained"
									onClick={handleSend}
									sx={{backgroundColor:"#B700cc"}}
									disabled
								>
									<SendIcon/>
								</Button>
							)
						}
					</Box>
					
				</Grid>

			</Grid>
		</Box>
  );  
};

export default PromptComponent;
