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

	async RequestUserStats(userId: string){
		try {
			if (AuthService.getIsLogged() != null)
			{
				const response = await axios.get((UserContentLink + userId + '/stats'),
					{ headers: AuthService.getAuthToken() });
				return (response.data);
			}
		} catch (error) {
			console.error('Error while requesting stats:', error);
			throw error;
		}
	}

	async RequestUserProfile(userId: string){
		try {
			const response = await axios.get((UserContentLink + userId + "/profile"),
				{ headers: AuthService.getAuthToken() });
			return (response);
		} catch (error) {
			console.error('Error while requesting user Profile:', error);
			throw error;
		}
	}
	
	async RequestAllUserStats(){
		try {
			if (AuthService.getIsLogged() != null)
			{
				const response = await axios.get((UserContentLink + 'AllStats'),
					{ headers: AuthService.getAuthToken() });
				return (response.data);
			}
		} catch (error) {
			console.error('Error while requesting stats:', error);
			throw error;
		}
	}

	async RequestProfilePic(picture: string){
		try {
			const authTokenQr = AuthService.getAuthToken();
			const response = await axios.get(BackLink + picture,
											{ headers: authTokenQr, responseType: 'arraybuffer' });
			return (response);
		} catch (error) {
			console.error("Error requesting profilePic:", error);
			throw error;
		}
	}

	async getProfilePicture(picture: string, userId: string): Promise<string> {
		let pic = picture;
		if (picture.includes(userId) === true) {
			await this.RequestProfilePic(picture).then(
				response => {
					if (response.data) {
						const imageBase64 = btoa(
							new Uint8Array(response.data)
							.reduce((data, byte) => data + String.fromCharCode(byte), '')
						)
						const imgElement = document.createElement('img');
						imgElement.src = `data:image/png;base64,${imageBase64}`;
						pic = imgElement.src;
					}
				},
				error => {
					const resMessage =
							(error.response &&
							error.response.data &&
							error.response.data.message) ||
							error.message ||
							error.toString();
					console.log(resMessage);
				}
				);			
		}
		return (pic);		
	}

	async getFriends(userId: string) {
		try {
			const authTokenQr = AuthService.getAuthToken();
			const response = await axios.get(`${UserContentLink}${userId}/friends/`, { headers: authTokenQr });
			return response;
		} catch (error) {
			console.error('Error fetching friends:', error);
			throw error;
		}
	}
	
	async sendFriendshipRequest(friendId: string) {
		try {
			if (AuthService.getIsLogged() != null && AuthService.getIdFromToken() !== friendId) {
				const ownerId = AuthService.getIdFromToken();
				const authTokenQr = AuthService.getAuthToken();
				const response = await axios.get(`${UserContentLink}${ownerId}/friends/${friendId}/send-request`, { headers: authTokenQr });
				return response;
			}
		} catch (error) {
			console.error("Error SendingFriendshipRequest", error);
			throw error;
		}
	}
	
	async acceptFriendshipRequest(friendId: string) {
		try {
			if (AuthService.getIsLogged() != null && AuthService.getIdFromToken() !== friendId) {
				const ownerId = AuthService.getIdFromToken();
				const authTokenQr = AuthService.getAuthToken();
				const response = await axios.get(`${UserContentLink}${ownerId}/friends/${friendId}/accept-request`, { headers: authTokenQr });
				return response;
			}
		} catch (error) {
			console.error("Error AcceptingFriendshipRequest", error);
			throw error;
		}
	}
	
	async denyFriendshipRequest(friendId: string) {
		try {
			if (AuthService.getIsLogged() != null && AuthService.getIdFromToken() !== friendId) {
				const ownerId = AuthService.getIdFromToken();
				const authTokenQr = AuthService.getAuthToken();
				const response = await axios.get(`${UserContentLink}${ownerId}/friends/${friendId}/deny-request`, { headers: authTokenQr });
				return response;
			}
		} catch (error) {
			console.error("Error DenyingFriendshipRequest", error);
			throw error;
		}
	}
	
	async removeFriend(friendId: string) {
		try {
			if (AuthService.getIsLogged() != null && AuthService.getIdFromToken() !== friendId) {
				const ownerId = AuthService.getIdFromToken();
				const authTokenQr = AuthService.getAuthToken();
				const response = await axios.get(`${UserContentLink}${ownerId}/friends/${friendId}/remove`, { headers: authTokenQr });
				return response;
			}
		} catch (error) {
			console.error("Error RemovingFriend", error);
			throw error;
		}
	}
	
	async getFriendshipStatus(friendId: string) {
		try {
			if (AuthService.getIsLogged() != null && AuthService.getIdFromToken() !== friendId) {
				const ownerId = AuthService.getIdFromToken();
				const authTokenQr = AuthService.getAuthToken();
				const response = await axios.get(`${UserContentLink}${ownerId}/friends/${friendId}/status`, { headers: authTokenQr });
				return response;
			}
		} catch (error) {
			console.error("Error GettingFriendshipStatus", error);
			throw error;
		}
	}
	
}
const userService = new UserService();

export default userService;
