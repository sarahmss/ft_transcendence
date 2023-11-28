import axios from "axios";
import { LocalSigninLink, LocalSignupLink } from "../common/constants";

class AuthService {
	login(userName: string, password: string) {
		return axios
			.post(LocalSigninLink, {
				userName,
				password
			})
			.then(response => {
				if (response.data.accessToken) {
					localStorage.setItem("user", JSON.stringify(response.data));
				}
				return response.data;
			});
	}

	logout() {
		localStorage.removeItem("user");
	}

	register(userName: string, email: string, password: string, passwordConfirm: string) {
		return axios.post(LocalSignupLink, {
			userName,
			email,
			password,
		passwordConfirm: passwordConfirm
		});
	}

	getCurrentUser() {
		const userStr = localStorage.getItem("user");
		if (userStr)
			return JSON.parse(userStr);

		return null;
	}

	getCurrentUserId() {
		const user = this.getCurrentUser();
		if (user && user.userId)
			return user.userId;
		return "";
	}

}

export default new AuthService();
