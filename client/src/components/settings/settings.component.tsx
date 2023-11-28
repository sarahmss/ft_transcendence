import React, { ChangeEvent } from 'react';
import { Card, CardHeader, CardContent, CardActions, Button, TextField } from '@mui/material';
import { getToken } from '../../common/helper';

interface SettingsState {
	twoFAEnabled: boolean;
	startUsername: string;
	username: string;
	avatar: string;
	loaded: boolean;
}

class Settings extends React.Component<{}, SettingsState> {
	constructor(props: {}) {
	super(props);
	this.state = {
		twoFAEnabled: false,
		startUsername: '',
		username: '',
		avatar: '',
		loaded: false,
	};
	}

	async componentDidMount() {
	const token = getToken();

	if (token === 'error') {
	//	 history.push('/login');
		return;
	}

	const response = await fetch(`http://${process.env.REACT_APP_BACK_HOST}/user/has2fa`, {
		method: 'GET',
		headers: {
		Authorization: 'Bearer ' + token,
		},
	});

	if (!response.ok) {
	//	 history.push('/login');
		return;
	}

	const data = await response.json();
	this.setState({ twoFAEnabled: data.enabled });

	// Restante do código de montagem...
	}

	render() {
	const messageClass = this.state.username.length === 0 ? 'md-invalid' : '';

	return (
		<div className="settings-content">

		<div className="md-layout md-gutter">
			<div style={{ margin: '100px 0' }} className="md-layout-item md-layout md-gutter md-alignment-top-center">
			<Card style={{ minWidth: '300px' }} className="md-layout-item md-size-65">

			<CardHeader
					title="User Settings"
					subheader="Update Avatar or Username"

			/>
			<CardContent style={{ textAlign: 'right', position: 'relative' }} className="md-layout md-layout-item md-alignment-center-center">
				<div className="md-layout-item">
					<div className="user-avatar-content">
					<img
						src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
						alt="profile-img"
						className="profile-img-card"
					/>
					</div>
				</div>
				<div className="md-layout md-layout-item md-alignment-center-left">
				<TextField
					label="Username"
					value={this.state.username}
					onChange={(e) => this.setState({ username: e.target.value })}
					variant="standard"
					fullWidth
					className={messageClass}
					required
					/>
				</div>

				</CardContent>
				<CardActions>
				<Button className="md-primary" variant="contained" color="primary" disabled={!this.state.twoFAEnabled} onClick={this.redirectToEnable2FA}>
					Enable 2FA
				</Button>
				<Button className="md-primary" variant="contained" color="primary" disabled={!this.state.loaded} onClick={this.applyChanges}>
					Update
				</Button>
				</CardActions>
			</Card>
			</div>
		</div>
		</div>
	);
	}

	private redirectToEnable2FA = () => {
	// history.push('/enable2fa');
	};

	private reditectToDisable2Fa = () => {
	// history.push('/disable2fa');
	};

	private applyChanges = async () => {
	// Restante do código para aplicar as alterações...
	};

	private onAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
	// Restante do código para lidar com a mudança do avatar...
	};
}

export default Settings;
