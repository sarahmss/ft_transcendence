import axios from 'axios';
import { AxiosError } from 'axios';
import AuthService from './auth.service';
import { TwoFaLink,
		TwoFaDisableLink,
		TwoFaEnableLink,
		TwoFaGenerateLink,
		TwoFaLoginLink } from '../common/constants';
import { truncate } from 'fs';

class TwoFaService {

	async handleAuthentication(userId: string, code: string) {
		try {
			const response = await axios.post(
			`${TwoFaLink} ${userId}`,
			{ code: code }
			);

			document.cookie = response.data.cookie;
		} catch (error) {
			console.error(error);
		}
	}

	async generateQrCode(): Promise<string> {
		try {
			const authToken = AuthService.getAuthToken();
			const response = await axios.get(TwoFaGenerateLink, { headers: authToken });

			sessionStorage.setItem("qrcode", response.data.url);
			return response.data.url;
		} catch (error) {
			console.error(error);
			throw new Error("Error generating QrCode");
		}
	}


	async redirectToEnable2FA(code: string) {
		try {
			const authToken = AuthService.getAuthToken();
			const response = await axios.post(TwoFaEnableLink,
				 							{ code: code },
											{ headers: authToken });
			return response;
		} catch (error) {
			console.error("Error while enable 2fa:", error);
			throw error;
		}
	}

	async redirectToDisable2FA(code: string) {
		try {
			const authToken = AuthService.getAuthToken();
			const response = await axios.post(TwoFaDisableLink, { code: code }, { headers: authToken });
			return (response);
		} catch (error) {
			console.error("Error while disable 2fa:", error);
			throw error;
		}
	}

	async login2Fa(code: string, userId: string) {
		try {
			const response = await axios.post(`${TwoFaLoginLink}?user=${userId}`,
			{ code: code });
			return response;
		} catch (error) {
			console.error("Error while login 2fa:", error);
			throw error;
		}
	}
}

const twoFaService = new TwoFaService();

export default twoFaService;
