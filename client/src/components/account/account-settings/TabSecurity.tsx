// ** React Imports
import { ChangeEvent, MouseEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import QrCodeIcon from '@mui/icons-material/QrCode';
import KeyOutline from 'mdi-material-ui/KeyOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

import TwoFaService from '../../../services/twoFa.service';
import AuthService from '../../../services/auth.service';
import axios from 'axios';
import IUser from '../../../types/user.type';
import { DefaultPic } from '../../../common/constants'
interface State {
	QrCodeImg: HTMLImageElement | null,
	TwoFaEnabled: boolean,
	QrCodeGenerated: boolean,
	Code: string,
}

interface TabSecurityProps {
	currentUser: IUser | null;
}

const TabSecurity: React.FC<TabSecurityProps> = ({ currentUser }) => {
	const [values, setValues] = useState<State>({
		TwoFaEnabled: currentUser?.hasTwoFactorAuth || false,
		QrCodeGenerated: currentUser?.hasTwoFactorAuth || false,
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
			setValues({ ...values, QrCodeImg: imgElement, QrCodeGenerated:true});
			} else {
				setValues({ ...values, QrCodeGenerated:false});
					}
				})
				.catch(error => {
					console.log(error);
				});
		}
	}

	// Handle QrCode field
	const handleEnable2FaChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [prop]: event.target.value })

	}

	const handleEnable2FaSend = () => {
		console.log("Sending Code...");
		TwoFaService.redirectToEnable2FA(values.Code);
		if (currentUser?.hasTwoFactorAuth === true) {
			setValues({ ...values, TwoFaEnabled: true});
		}
	  };

const handleEnable2FAClick = () => {
	TwoFaService.generateQrCode();
	getQrCode();
	// setValues({ ...values, QrCodeGenerated: true, TwoFaEnabled: false});

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
			{values.QrCodeGenerated ? (
							values.TwoFaEnabled ? (
								<Typography sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}>
									Two factor authentication is enabled.
								</Typography>
							) : (
								<Typography sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}>
									{values.QrCodeImg ? (
										<img src={values.QrCodeImg.src} alt='' />
									) : (
										<div>{'Error Loading QR code...'}</div>
									)}

									<Grid item xs={12} sx={{ marginTop: 6 }}>
										<FormControl fullWidth>
											<InputLabel htmlFor='account-enable-2fa'>Code</InputLabel>
											<OutlinedInput
												label='Code'
												value={values.Code}
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
											<Button
												className="md-primary"
												variant='contained'
												size='small'
												sx={{ marginRight: 3.5, backgroundColor: '#B700cc' }}
												onClick={handleEnable2FaSend}
											>
												Send
											</Button>
										</FormControl>
									</Grid>
								</Typography>
							)
						) : (
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

				<Box sx={{ mt: 5.75, display: 'flex',  justifyContent:'center'}}>
					{ values.TwoFaEnabled ?
						(
							<Button
								className="md-primary"
								variant='contained'
								size='large'
								sx={{ marginRight: 3.5, backgroundColor: '#B700cc' }}
								onClick={handleEnable2FAClick}>
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
