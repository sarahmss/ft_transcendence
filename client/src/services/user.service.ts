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

	uploadProfilePic(imgName: string, img: FormData) {
		const userId = AuthService.getCurrentUserId();

		return axios.post(`${BackLink}/uploads/${userId}/profilePictures/${imgName}`, {file: img}, {headers: AuthService.getAuthToken() });
	}
}

const userService = new UserService();

export default userService;
