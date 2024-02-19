import React, { Component } from "react";
import TransPong from '../assets/home.jpeg';
import "./home.component.css"
import {FrontLogin, FrontGame} from "./../common/constants";
import { Grid, Button, Link, Box, Typography } from "@mui/material";
import ChatComponent from "./chat/chat.component";
import authService from "../services/auth.service";
import { appSocket } from "./../common/constants";
import { userLogged } from "../contexts/ChatContext";
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

const Home: React.FC = () => {
	const [isLogged, setIsLogged] = React.useState(false);

	const fetchData = async () => {
		try {
		  const user = await authService.getCurrentUser();
			if (user) {
				userLogged.value=true;
			  setIsLogged(true);
			  appSocket.connect();
			} else {
				userLogged.value=false;
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

				<Grid item xs={12} md={6} lg={4} sx={{ paddingLeft: "0px"}}>
					<Box sx={{
						display: "flex",
						justifyContent:"center"}}>
					{isLogged ? (
						<Link href={FrontGame}>
						<Button
							className="md-primary"
							variant='contained'
							size='large'
							sx={{  backgroundColor: '#B700cc', 
							marginTop:'10px' }}
							>
							Play !
						</Button>
					</Link>
				) : (
					
					<Grid container spacing={3} sx={{ display: 'flex',
					alignItems: 'center',
								justifyContent: "center",
								marginTop:"50%" }}>
						<Grid item  >
							<Typography variant="h4" 
							sx={{
								mr: 2,
								display: { xs: 'none', md: 'flex' },
								fontFamily: 'monospace',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: '#B700cc',
								textDecoration: 'none',
							}}>
							TRANSCENDENCE
							<SelfImprovementIcon/>
							</Typography>
						</Grid>
						<Grid item >
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
						</Grid>
					</Grid>
				)}
					</Box>
				{isLogged ? (<ChatComponent/>):(<></>)}
				</Grid>
			</Grid>
			</div>
		);
}
export default Home;
