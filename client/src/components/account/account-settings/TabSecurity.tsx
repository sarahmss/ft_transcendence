import { ChangeEvent, useReducer } from 'react'
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
		InputAdornment,
		Alert
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

interface SendButtonProps {
	code: string;
	TwoFaEnabled: boolean;
	setTwoFaEnabled: React.Dispatch<React.SetStateAction<{ TwoFaEnabled: boolean }>>;
	setErrorCode: React.Dispatch<React.SetStateAction<{ errorCode: string }>>;
	setQrCodeImgAvailable: React.Dispatch<React.SetStateAction<{  QrCodeImgAvailable: boolean }>>;
}

const SendButton: React.FC<SendButtonProps> =({ code,
	TwoFaEnabled, setTwoFaEnabled,
	setErrorCode, setQrCodeImgAvailable
 }) => {

	const handleRedirectToEnable2Fa = async () => {
		await TwoFaService.redirectToEnable2FA(code).then(
			response => {
				setTwoFaEnabled({TwoFaEnabled: true});
			},
			error => {
				const resMessage =
						(error.response &&
						error.response.data &&
						error.response.data.message) ||
						error.message ||
						error.toString()

				setErrorCode({errorCode: resMessage});
				setTwoFaEnabled({TwoFaEnabled: false}); 
				}
			);
	};

	const handleRedirectToDisable2Fa = () => {

		TwoFaService.redirectToDisable2FA(code).then(
			response => {
				setTwoFaEnabled({TwoFaEnabled: false});
				setQrCodeImgAvailable({ QrCodeImgAvailable: false });
			},
			error => {
				const resMessage =
						(error.response &&
						error.response.data &&
						error.response.data.message) ||
						error.message ||
						error.toString()

				setErrorCode({errorCode: resMessage});
				}
			);
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

interface InsertCodeProps {
	code: string;
	TwoFaEnabled: boolean;
	setTwoFaEnabled: React.Dispatch<React.SetStateAction<{ TwoFaEnabled: boolean }>>;
	setCode: React.Dispatch<React.SetStateAction<{ code: string }>>;
	setErrorCode: React.Dispatch<React.SetStateAction<{ errorCode: string }>>;
	setQrCodeImgAvailable: React.Dispatch<React.SetStateAction<{ QrCodeImgAvailable: boolean }>>;
}

const InsertCode: React.FC<InsertCodeProps> = ({ code, TwoFaEnabled, setTwoFaEnabled, setCode, setErrorCode, setQrCodeImgAvailable }) => {

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setCode({ code: event.target.value });
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
		}
	};

	return (
		<FormControl fullWidth>
		<InputLabel htmlFor='account-insert-code'>Code</InputLabel>
		<OutlinedInput
			label='Code'
			id='account-insert-code'
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			type={'text'}
			endAdornment={
			<InputAdornment position='end'>
				<IconButton edge='end' aria-label='qrCode'>
				<QrCodeIcon />
				</IconButton>
			</InputAdornment>
			}
		/>
		<SendButton code={code}
					TwoFaEnabled={TwoFaEnabled}
					setTwoFaEnabled={setTwoFaEnabled}
					setErrorCode={setErrorCode}
					setQrCodeImgAvailable={setQrCodeImgAvailable}
		/>
		</FormControl>
	);
};


interface TabSecurityProps {
	currentUser: IUser | null;
}
const TabSecurity: React.FC<TabSecurityProps> = ({ currentUser }) => {

	const handleEnable2FAClick = async () => {
		try {
		if (state.QrCodeGenerated === false) {
			await TwoFaService.generateQrCode();
			setState({ ...state, QrCodeGenerated: true });
		}
		await getQrCode();
		} catch (error) {
			console.error("Erro ao habilitar 2FA:", error);
		}
	};

	const handleDisable2FAClick = () => {
		setState({ ...state, TwoFaDisable: true});
	}

	const getQrCode = async (): Promise<void> => {
		const authTokenQr = AuthService.getAuthToken();
		const localQr = sessionStorage.getItem("qrcode");

		return new Promise<void>(async (resolve, reject) => {
			if (localQr) {
			try {
				console.log("Qrcode: ",localQr);
				const response = await axios.get(localQr, { headers: authTokenQr, responseType: 'arraybuffer' });

				if (response.data) {
				const imageBase64 = btoa(
					new Uint8Array(response.data)
					.reduce((data, byte) => data + String.fromCharCode(byte), '')
				);
				const imgElement = document.createElement('img');
				imgElement.src = `data:image/png;base64,${imageBase64}`;
				setState({ ...state, QrCodeImg: imgElement, QrCodeImgAvailable: true });
				resolve();
				} else {
				setState({ ...state, QrCodeImgAvailable: false });
				reject(new Error("Unable to Get QrCode Img"));
				}
			} catch (error) {
				console.log(error);
				reject(error);
			}
			} else {
				reject(new Error("Unavailable Qr Code"));
			}
		});
	};
	
	const [state, setState] = useReducer(reducer, {
		TwoFaEnabled: currentUser?.hasTwoFactorAuth || false,
		QrCodeGenerated: currentUser?.hasTwoFactorAuth || false,
		QrCodeImgAvailable:	currentUser?.hasTwoFactorAuth || false,
		TwoFaDisable: false,
		QrCodeImg: null,
		Code: '',
		errorCode: '',
		});

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
						{state.QrCodeImgAvailable ?
						(
							<Typography sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}>
							{state.TwoFaEnabled ?
							(
								state.TwoFaDisable ?
								(
									<div>
										To disable two-factor authentication, send the code.
										<Grid item xs={12} sx={{ marginTop: 6 }}>
											<InsertCode
												code={state.code}
												TwoFaEnabled={state.TwoFaEnabled}
												setTwoFaEnabled={setState}
												setQrCodeImgAvailable={setState}
												setCode={setState}
												setErrorCode={setState}
											/>
										</Grid>
									</div>
								)
								:
								(
									<div>
										Two-factor authentication is enabled.
									</div>
								)
							)
							:
							(
								<div>
									{state.QrCodeImg ? (
										<img src={state.QrCodeImg.src} alt='' />
									) : (
										<div>{'Error Loading QR code...'}</div>
									)}
									<Grid item xs={12} sx={{ marginTop: 6 }}>
										{state.errorCode ? (<Alert severity="error"> {state.errorCode} </Alert>):(<label></label>)}
										<InsertCode
												code={state.code}
												TwoFaEnabled={state.TwoFaEnabled}
												setTwoFaEnabled={setState}
												setQrCodeImgAvailable={setState}
												setCode={setState}
												setErrorCode={setState}
										/>
									</Grid>
								</div>
							)
							}
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

				<Box sx={{display: 'flex',	justifyContent:'center'}}>
				<Button
					className="md-primary"
					variant='contained'
					size='large'
					sx={{backgroundColor: '#B700cc' }}
					onClick={state.TwoFaEnabled ? (handleDisable2FAClick)
						: (handleEnable2FAClick)}>
					{state.TwoFaEnabled ? ("Disable 2FA") : ("Enable 2Fa")}
				</Button>
				</Box>
			</CardContent>
		</form>
	)
}

export default TabSecurity
