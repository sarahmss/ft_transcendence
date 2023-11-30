import axios from 'axios';
import authHeader from './authHeader';
import { UserContentLink, PublicContentLink } from '../common/constants';
import AuthService from './auth.service';
import { ChangeEvent } from 'react';
import { TwoFaLink } from '../common/constants';

class UserService {
	getPublicContent() {
		return axios.get(PublicContentLink);
	}
	getUserBoard() {
		const userId = AuthService.getCurrentUserId();
		return axios.get(`${UserContentLink}/${userId}/profile`, { headers: authHeader() });
	}

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

export default new UserService();
