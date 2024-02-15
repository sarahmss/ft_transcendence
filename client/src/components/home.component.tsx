import React, { Component } from "react";
import TransPong from '../assets/home.jpeg';
import "./home.component.css"
import {FrontLogin, FrontGame} from "./../common/constants";
import { Grid, Button, Link, Box } from "@mui/material";
import ChatComponent from "./chat/chat.component";
import authService from "../services/auth.service";
import { appSocket } from "./../common/constants";

const Home: React.FC = () => {
	const [isLogged, setIsLogged] = React.useState(false);

	const fetchData = async () => {
		try {
		  const user = await authService.getCurrentUser();
			if (user) {
			  setIsLogged(true);
			  appSocket.connect()
			} else {
			  setIsLogged(false);
			}
		  } catch (error) {
			console.error("Error fetching user data:", error);
		  }
	  };
	
	  React.useEffect(() => {
		fetchData();
	  }, );	

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
					{isLogged ? (
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
export default Home;
