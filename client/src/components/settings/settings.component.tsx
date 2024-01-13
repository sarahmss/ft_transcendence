import	React, { Component } from 'react';
import {Card, CardHeader, CardContent, CardActions, Button, TextField } from '@mui/material';
import AuthService from "../../services/auth.service";
import IUser from "../../types/user.type";
import { Navigate } from "react-router-dom";
import TwoFaService from '../../services/twoFa.service';
import './settings.component.css';
import Popup from './popup'
import userService from '../../services/user.service';
import { ProfilePicComponent } from './picture.component';

type Props = {};

type SettingsState = {
	redirect: string | null,
	currentUser: IUser & { accessToken: string }
	twoFAEnabled: boolean;
	userName: string;
	update: boolean;
	showLabelAndImage: boolean;
}
export default class Settings extends Component<Props, SettingsState> {

	constructor(props: Props) {
		super(props);

		this.state = {
		redirect: null,
		currentUser: { accessToken: "" },
		twoFAEnabled: true,
		userName: '',
		update: false,
		showLabelAndImage: false,
		};
	}

	componentDidMount() {
		const currentUser = AuthService.getCurrentUser();

		if (!currentUser) this.setState({ redirect: "/" });
		this.setState({ currentUser: currentUser })
	}

	handleEnable2FAClick = () => {
			console.log("entrou cá");
			TwoFaService.generateQrCode();
			this.setState({
				showLabelAndImage: true,
			});
	}

	render() {
		if (this.state.redirect) {
			return <Navigate to={this.state.redirect} />
		}
	const { currentUser } = this.state;

	const messageClass = this.state.userName.length === 0 ? 'md-invalid' : '';

	return (
		<div className="settings-content">
		<div className="md-layout md-gutter container mt-3">
			<div style={{ margin: '100px 0' }} className="md-layout-item md-layout md-gutter md-alignment-top-center">
			<Card style={{ minWidth: '300px' }} className="md-layout-item md-size-65">

			<CardHeader
					title="User Settings"
					subheader="Update Avatar or UserName"
			/>

			<CardContent style={{ textAlign: 'right', position: 'relative' }} className="md-layout md-layout-item md-alignment-center-center">

			<ProfilePicComponent
				currentUser={currentUser}
			 />

				<div className="md-layout md-layout-item md-alignment-center-left">
				<TextField
					label="UserName"
					value={currentUser.userName}
					onChange={(e) => this.setState({ userName: e.target.value })}
					variant="standard"
					fullWidth
					className={messageClass}
					required
					/>
				</div>
				</CardContent>
					<CardActions>
				<Button className="md-primary" variant="contained" color="primary" disabled={!this.state.twoFAEnabled} onClick={this.handleEnable2FAClick}>
					Enable 2FA
				</Button>
				<Button className="md-primary" variant="contained" color="primary" disabled={!this.state.update}>
					Update
				</Button>
				{this.state.showLabelAndImage && (
					<div className="App">
						<Popup
							buttonText=""
							popupTitle=""
							popupContent=""
						/>
					</div>
				)}
				</CardActions>
			</Card>
			</div>
		</div>
		</div>
	);
	}
}
