import axios, {RawAxiosRequestHeaders} from 'axios';
import AuthService from './auth.service';
import { ChangeEvent } from 'react';
import { TwoFaLink, TwoFaEnableLink } from '../common/constants';

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

	// getQRcode = async ({ setState } : { setState: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>}) => {
	// 	const authToken: RawAxiosRequestHeaders  = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	// 	const response = (await axios.get(process.env.REACT_APP_BACK_HOST + '/two-factor-auth/generate', { headers: authToken }));
	// 	setState({ qrcode: response.data.url });
	// }

	redirectToEnable2FA = () => {
		// history.push('/enable2fa');
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
