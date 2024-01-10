import axios from 'axios';
import AuthService from './auth.service';
import { DefaultPic,
		TwoFaLink,
		TwoFaDisableLink,
		TwoFaEnableLink,
		TwoFaGenerateLink,
		TwoFaLoginLink } from '../common/constants';

class TwoFaService {

	handleAuthentication(userId: string, code: string) {
		axios
			.post(
				`${TwoFaLink} ${userId}`,
				{ code: code })
			.then((response) => {
				document.cookie = response.data.cookie;
			}).catch(() => {
			});
	}

	getQrCode(){
		const authTokenQr = AuthService.getAuthToken();
		const localQr = localStorage.getItem("qrcode");

		if(localQr)
		{
			axios.get(localQr,
			{headers : authTokenQr})
			.then((response) => {
				return (response);
			})
			.catch(error => {
				console.log(error);
			});
		}
		return (DefaultPic)
	}

	generateQrCode() {
		const authToken = AuthService.getAuthToken()
		axios.get( TwoFaGenerateLink,
				{ headers: authToken })
				.then((response) => {
						localStorage.setItem("qrcode", response.data.url)
				});
		}


	redirectToEnable2FA (code:string) {
		const authToken = AuthService.getAuthToken();

		axios.post( TwoFaEnableLink,
					{ code: code },
					{ headers: authToken });
	};

	redirectToDisable2FA (code:string) {
		const authToken = AuthService.getAuthToken()

		axios.post( TwoFaDisableLink,
					{ code: code },
					{ headers: authToken });
	};

	Login2Fa (code:string, userId: string)
	{
		axios .post(`${TwoFaLoginLink}?user=${userId}`, { code: code })
		.then((response) => {
			document.cookie = response.data.cookie;
			return (true);
		})
		.catch(() => {
			return (false);
		});
		return (false);
	};
}
const twoFaService = new TwoFaService();

export default twoFaService;
