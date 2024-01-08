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

		axios.post(
			`${BackLink}/uploads/${userId}/profilePictures/${imgName}`,
			img,
			{headers: AuthService.getAuthToken()})
			.then(response => {
			if (response.data.url) {
				return (response.data.url);
			}
		});
	}

	updateProfile(userName: string, profilePicture: string, email: string){
		const userId = AuthService.getCurrentUserId();

		axios.patch(
			`${BackLink}/${userId}`,
			{
				userName: userName,
				profilePicture: profilePicture,
				email: email
			},
			{headers: AuthService.getAuthToken()});
	}

	applyChanges() {
		// Restante do código para aplicar as alterações...
	};
}

const userService = new UserService();

export default userService;
