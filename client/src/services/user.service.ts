import axios from 'axios';
import { BackLink, PublicContentLink } from '../common/constants';
import AuthService from './auth.service';

class UserService {
	getPublicContent() {
		return axios.get(PublicContentLink);
	}

	getUserBoard() {
		const userId = AuthService.getCurrentUserId();
		return axios.get(`${BackLink}/${userId}/profile`, { headers: AuthService.getAuthToken() });
	}
}

export default new UserService();
