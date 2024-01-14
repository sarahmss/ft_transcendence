import axios from 'axios';
import { BackLink, PublicContentLink } from '../common/constants';
import AuthService from './auth.service';

class UserService {

	async uploadProfilePic(imgName: string, img: FormData): Promise<string | undefined> {
		const userId = AuthService.getCurrentUserId();

		try {
			const response = await axios.post(
			`${BackLink}/uploads/${userId}/profilePictures/${imgName}`,
			img,
			{ headers: AuthService.getAuthToken() }
			);

			if (response.data.url) {
			return response.data.url;
			}

			return undefined;
		} catch (error) {
			console.error('Error during uploadProfilePic:', error);
			throw error;
		}
	}

	async updateProfile(userName: string, profilePicture: string, email: string): Promise<void> {
		const userId = AuthService.getCurrentUserId();

		try {
			await axios.patch(
				`${BackLink}/${userId}`,
				{
					userName: userName,
					profilePicture: profilePicture,
					email: email
				},
				{ headers: AuthService.getAuthToken() }
			);
		} catch (error) {
			console.error('Error during updateProfile:', error);
			throw error;
		}
	}
	applyChanges() {
		// Restante do código para aplicar as alterações...
	};
}

const userService = new UserService();

export default userService;
