import axios from 'axios';
import { BackLink, UserContentLink } from '../common/constants';
import AuthService from './auth.service';

class UserService {
	
	
	async uploadProfilePic(imgName: string, img: FormData): Promise<string | undefined> {
		const userId = AuthService.getIdFromToken();

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
		const userId = AuthService.getIdFromToken();

		try {
			await axios.patch((UserContentLink + userId),
				{
					userName: userName,
					profilePicture: profilePicture,
					email: email
				},
				{ headers: AuthService.getAuthToken() }
			);
		} catch (error) {
			console.error('Error while updating profile:', error);
			throw error;
		}
	}

	async RequestUserStats(){
		const userId = AuthService.getIdFromToken();

		try {
			if (AuthService.getIsLogged() != null)
			{
				const response = await axios.get((UserContentLink + userId + '/profile'),
					{ headers: AuthService.getAuthToken() });
				return (response.data);
			}
		} catch (error) {
			console.error('Error while requesting stats:', error);
			throw error;
		}
	}
}
const userService = new UserService();

export default userService;
