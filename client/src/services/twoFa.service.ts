import axios, {RawAxiosRequestHeaders} from 'axios';
import AuthService from './auth.service';
import { ChangeEvent } from 'react';
import { TwoFaLink, TwoFaEnableLink } from '../common/constants';
import authService from './auth.service';

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

		console.log(localQr);
		console.log(authTokenQr);
		if(localQr)
		{
			axios.get(localQr, 
			{headers : authTokenQr})
			.then((response) => {
				console.log("Deu certo");
			})
			.catch(error => {
				console.log("Deu errado!");
			  });

		} else {
			console.log("teste");
		}
	}

	generateQrCode() {
        const authToken = AuthService.getAuthToken()
        axios.get( "http://localhost:5000/2fa-auth/generate",
            { headers: authToken })
            .then((response) => {
				console.log("Response data: ", response.data)
                localStorage.setItem("qrcode", response.data.url)
				console.log("foi");
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

	applyChanges = async () => {
	// Restante do código para aplicar as alterações...
	};

	onAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
	// Restante do código para lidar com a mudança do avatar...
	};

}

export default new TwoFaService();
