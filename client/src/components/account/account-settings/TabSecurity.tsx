import { ChangeEvent, useState, useEffect, useReducer } from 'react'
import {Box,
		Grid,
		Avatar,
		Button,
		InputLabel,
		IconButton,
		Typography,
		CardContent,
		FormControl,
		OutlinedInput,
		InputAdornment
	} from '@mui/material';

// ** Icons Imports
import QrCodeIcon from '@mui/icons-material/QrCode';
import KeyOutline from 'mdi-material-ui/KeyOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

import TwoFaService from '../../../services/twoFa.service';
import AuthService from '../../../services/auth.service';
import axios from 'axios';
import IUser from '../../../types/user.type';
import { reducer } from '../../../common/helper';


interface State {
	QrCodeImg: HTMLImageElement | null,
	TwoFaEnabled: boolean,
	QrCodeGenerated: boolean,
	TwoFaDisable: boolean,
	Code: string,
}


interface SendButtonProps {
	code: string;
	TwoFaEnabled: boolean;
	setTwoFaEnabled: React.Dispatch<React.SetStateAction<{ TwoFaEnabled: boolean }>>;
}
const SendButton: React.FC<SendButtonProps> =({ code,
	TwoFaEnabled,
	setTwoFaEnabled }) => {

	const handleRedirectToEnable2Fa = () => {
	  TwoFaService.redirectToEnable2FA(code);
	  setTwoFaEnabled({TwoFaEnabled: true});
	};

	const handleRedirectToDisable2Fa = () => {
	  TwoFaService.redirectToDisable2FA(code);
	  setTwoFaEnabled({TwoFaEnabled: false});
	};

	return (
	  <Box sx={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
		<Button
		  className="md-primary"
		  variant="contained"
		  size="small"
		  sx={{ backgroundColor: '#B700cc' }}
		  onClick={TwoFaEnabled ? handleRedirectToDisable2Fa : handleRedirectToEnable2Fa}
		>
		  Send
		</Button>
	  </Box>
	);
  };


interface TabSecurityProps {
	currentUser: IUser | null;
}

const TabSecurity: React.FC<TabSecurityProps> = ({ currentUser }) => {

	useEffect(() => {
	});

	const [state, setState] = useReducer(reducer, {
		TwoFaEnabled: currentUser?.hasTwoFactorAuth || false,
		QrCodeGenerated: currentUser?.hasTwoFactorAuth || false,
		TwoFaDisable: false,
		QrCodeImg: null,
		Code: '',
	  });

	const getQrCode = () => {
		const authTokenQr = AuthService.getAuthToken();
		const localQr = localStorage.getItem("qrcode");
		if (localQr) {
			axios.get(localQr, { headers: authTokenQr, responseType: 'arraybuffer' })
				.then((response) => {
					if (response.data) {
						const imageBase64 = btoa(
							new Uint8Array(response.data)
								.reduce((data, byte) => data + String.fromCharCode(byte), '')
						);
						const imgElement = document.createElement('img');
						imgElement.src = `data:image/png;base64,${imageBase64}`;
			setState({ ...state, QrCodeImg: imgElement, QrCodeGenerated:true});
			} else {
				setState({ ...state, QrCodeGenerated:false});
					}
				})
				.catch(error => {
					console.log(error);
				});
		}
	}

	// Handle QrCode field
	const handleEnable2FaChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [prop]: event.target.value })
	}
	const handleDisable2FaChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [prop]: event.target.value })
	}

	const handleEnable2FAClick = () => {
		// TwoFaService.generateQrCode();
		// getQrCode();
		setState({ ...state, QrCodeGenerated:true });

	}
	const handleDisable2FAClick = () => {
		setState({ ...state, TwoFaDisable: true});
	}

	return (
		<form>
			<CardContent>
				<Box sx={{ mt: 1.75, display: 'flex', alignItems: 'center' }}>
					<KeyOutline sx={{ marginRight: 3 }} />
					<Typography variant='h6'>Two-factor authentication</Typography>
				</Box>

				<Box sx={{ mt: 5.75, display: 'flex', justifyContent: 'center' }}>
					<Box
						sx={{
							maxWidth: 368,
							display: 'flex',
							textAlign: 'center',
							alignItems: 'center',
							flexDirection: 'column'
						}}
					>
						<Avatar
							variant='rounded'
							sx={{ width: 48, height: 48, color: 'common.white', backgroundColor: '#B700cc' }}
						>
							<LockOpenOutline sx={{ fontSize: '1.75rem', backgroundColor: '#B700cc'	}} />
						</Avatar>
			{state.QrCodeGenerated ? (
							<Typography sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}>
							{state.TwoFaEnabled ? (
								state.TwoFaDisable ? (
								<div>
									To disable two-factor authentication, send the code.
									<Grid item xs={12} sx={{ marginTop: 6 }}>
									<FormControl fullWidth>
										<InputLabel htmlFor='account-disable-2fa'>Code</InputLabel>
										<OutlinedInput
										label='Code'
										value={state.Code}
										id='account-disable-2fa'
										onChange={handleDisable2FaChange('Code')}
										type={'text'}
										endAdornment={
											<InputAdornment position='end'>
											<IconButton edge='end' aria-label='qrCode'>
												<QrCodeIcon />
											</IconButton>
											</InputAdornment>
										}
										/>
										<SendButton
											code={state.Code}
											TwoFaEnabled={state.TwoFaEnabled}
											setTwoFaEnabled={setState}
										/>

									</FormControl>
									</Grid>
								</div>
								) : (
								<div>
									Two-factor authentication is enabled.
								</div>
								)
							) : (
								<div>
								{state.QrCodeImg ? (
									<img src={state.QrCodeImg.src} alt='' />
								) : (
									<div>{'Error Loading QR code...'}</div>
								)}
								<Grid item xs={12} sx={{ marginTop: 6 }}>
									<FormControl fullWidth>
									<InputLabel htmlFor='account-enable-2fa'>Code</InputLabel>
									<OutlinedInput
										label='Code'
										value={state.Code}
										id='account-enable-2fa'
										onChange={handleEnable2FaChange('Code')}
										type={'text'}
										endAdornment={
										<InputAdornment position='end'>
											<IconButton edge='end' aria-label='qrCode'>
											<QrCodeIcon />
											</IconButton>
										</InputAdornment>
										}
									/>
										<SendButton
											code={state.Code}
											TwoFaEnabled={state.TwoFaEnabled}
											setTwoFaEnabled={setState}
										/>
									</FormControl>
								</Grid>
								</div>
							)}
							</Typography>
						)
						:
						(
							<Typography sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}>
								Two factor authentication is not enabled yet.
							</Typography>
			)}

				<Typography variant='body2'>
				Two-factor authentication adds an additional layer of security to your account by requiring more than just
				a password to log in.
				</Typography>

					</Box>
				</Box>

				<Box sx={{ mt: 5.75, display: 'flex',	justifyContent:'center'}}>
					{ state.TwoFaEnabled ?
						(
							<Button
								className="md-primary"
								variant='contained'
								size='large'
								sx={{ marginRight: 3.5, backgroundColor: '#B700cc' }}
								onClick={handleDisable2FAClick}>
								Disable 2FA
							</Button>
						)
						:
						(
							<Button
								className="md-primary"
								variant='contained'
								size='large'
								sx={{ marginRight: 3.5, backgroundColor: '#B700cc' }}
								onClick={handleEnable2FAClick}>
								Enable 2FA
							</Button>
						)
					}
				</Box>
			</CardContent>
		</form>
	)
}
export default TabSecurity
