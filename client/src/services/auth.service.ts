import axios, { RawAxiosRequestHeaders }  from "axios";
import { LocalSigninLink,
		LocalSignupLink,
		UserContentLink,
		tokenData } from "../common/constants";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
class AuthService {
	LocalLogin(userName: string, password: string) {
		return axios
			.post(LocalSigninLink, {
				userName,
				password
			})
			.then(response => {
					localStorage.setItem("Logged","yes");
					console.log(`setting local user logged: ${this.getIsLogged()}`);
				return response.data;
			});
	}

	IntraLogin() {
		localStorage.setItem("Logged","yes");
		console.log(`setting intra user logged: ${this.getIsLogged()}`);
	}

	logout() {
		localStorage.removeItem("LoggedUser");
	}

	getIsLogged()
	{
		const isLogged = localStorage.getItem("Logged");
		if (isLogged)
			return isLogged;

		return null;
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
		if (this.getIsLogged() != null)
		{
			this.RequestCurrentUser();
			const userStr = localStorage.getItem("LoggedUser");
			if (userStr)
				return JSON.parse(userStr);
		}
		return null;
	}

	RequestCurrentUser() {
		const userId = this.getIdFromToken();
		const authToken = this.getAuthToken();
		console.log(`Request currente user: ${authToken}`);
		axios.get(UserContentLink + userId, { headers: authToken }).then((response) => {
			localStorage.setItem("LoggedUser", JSON.stringify(response.data))
			return response.data;
		})
	}

	getCurrentUserId() {
		const user = this.getCurrentUser();
		if (user && user.userId)
			return user.userId;
		return "";
	}

	getAuthToken() {
		const authToken: RawAxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		return authToken;
	}

	getIdFromToken() {
		const tokenData: tokenData = jwtDecode(document.cookie);
		return tokenData.id;
	}
}

export default new AuthService();
