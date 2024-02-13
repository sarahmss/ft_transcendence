import { Component } from "react";
import TransPong from '../assets/home.jpeg';
import "./home.component.css"
import {FrontLogin, FrontGame} from "./../common/constants";
import { Grid, Card, Button, Link, Box } from "@mui/material";
import ChatComponent from "./chat/chat.component";
type Props = {};

type State = {
	content: string;
	isLogged: boolean;
}

export default class Home extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			content: "Chat",
			isLogged: false,
		};
	}

	render() {
		return (
			<div >
			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
				<div>
					<img
					src={TransPong}
					alt="TransPong"
					style={{ width: "100%", objectFit: "cover", height: "100%" }}
					/>
				</div>
				</Grid>
				<Grid item xs={12} md={6} lg={4}>
					<ChatComponent/>

					<Box sx={{
						display: "flex",
						justifyContent:"center"}}>

					{this.state.isLogged ? (
						<Link href={FrontGame}>
						<Button
							className="md-primary"
							variant='contained'
							size='large'
							sx={{  backgroundColor: '#B700cc' }}
							>
							Play !
						</Button>
					</Link>
				) : (
					<Link href={FrontLogin}>
						<Button
							className="md-primary"
							variant='contained'
							size='large'
							sx={{ backgroundColor: '#B700cc' }}
							>
							Please, Log In !
						</Button>
					</Link>
				)}
					</Box>
				</Grid>
			</Grid>
			</div>
		);
		}
}
