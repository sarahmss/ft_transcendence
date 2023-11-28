import axios from 'axios';
import authHeader from './authHeader';
import { UserContentLink, PublicContentLink } from '../common/constants';
import AuthService from './auth.service';

class UserService {
	getPublicContent() {
		return axios.get(PublicContentLink);
	}
	getUserBoard() {
		const userId = AuthService.getCurrentUserId();
		return axios.get(`${UserContentLink}/${userId}/profile`, { headers: authHeader() });
	}
}

export default new UserService();
