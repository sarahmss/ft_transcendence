import axios from 'axios';
import AuthService from './auth.service';
import { ChangeEvent } from 'react';
import { TwoFaLink } from '../common/constants';

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

	// redirectToEnable2FA = (code: string) => {
	// 	return axios.post(
	// 		TwoFaEnableLink,
	// 		{ code: code },
	// 		{ headers: authHeader() }
	// 	)
	// }

	// if(authService.getIsLogged())
	// 	return localStorage.getItem("qrcode");

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
		return ("https://ssl.gstatic.com/accounts/ui/avatar_2x.png")
	}

	generateQrCode() {
        const authToken = AuthService.getAuthToken()
        axios.get( "http://localhost:5000/2fa-auth/generate",
            { headers: authToken })
            .then((response) => {
                localStorage.setItem("qrcode", response.data.url)
            });
    }


	redirectToEnable2FA (code:string) {
		const userID = AuthService.getAuthToken();
		console.log(code);
        axios.post( "http://localhost:5000/2fa-auth/enable",
			{ code: code },
            { headers: userID })
            .then((response) => {
                localStorage.setItem("qrcode", response.data.url)
            })
			.catch(error =>{
				console.log(error);
			});
	};

	redirectToDisable2FA (userId:string, code:string) {
		const authToken = AuthService.getAuthToken()
        axios.post( "http://localhost:5000/2fa-auth/disable",
			{ code: code },
            { headers: authToken })
            .then((response) => {
                localStorage.setItem("qrcode", response.data.url)
            });
	};

	reditectToDisable2Fa = () => {
	// history.push('/disable2fa');
	};
}
const twoFaService = new TwoFaService();

export default twoFaService;
