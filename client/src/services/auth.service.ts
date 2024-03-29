import axios, { RawAxiosRequestHeaders }	from "axios";


import { BackLink, LocalSigninLink,
		LocalSignupLink,
		UserContentLink,
		tokenData } from "../common/constants";


import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";

class AuthService {

	async LocalLogin(userName: string, password: string) {
		try {
			const response = await axios.post(LocalSigninLink, {
				userName,
				password,
			});
			return (response);
		} catch (error) {
			console.error("Error during LocalLogin:", error);
			throw error;
		}
	}

	IntraLogin() {
		sessionStorage.setItem("Logged", "ok");
	}

	async logout() {
		try {
			const authToken = this.getAuthToken();
			const userId = this.getIdFromToken();
			sessionStorage.clear();
			await axios.get(BackLink + `/auth/${userId}/logout`, { headers: authToken });
		} catch (error) {
			console.error("Error during logout:", error);
			throw error;
		}
	}

	getIsLogged() {
		const isLogged = (sessionStorage.getItem("Logged") && document.cookie) ? true : false;
		return isLogged;
	}

	async register(userName: string, email: string, password: string, passwordConfirm: string) {
		try {
				const response = await axios.post(LocalSignupLink, {
				userName,
				email,
				password,
				passwordConfirm,
			});
			return response;
		} catch (error) {
			console.error("Error during register:", error);
			throw error;
		}
	}

	async RequestCurrentUser() {
		try {
			const userId = this.getIdFromToken();
			const authToken = this.getAuthToken();
			const response = await axios.get(UserContentLink + userId, { headers: authToken });

			sessionStorage.setItem("LoggedUser", JSON.stringify(response.data));

			return response.data;
		} catch (error) {
			console.error("Error during RequestCurrentUser:", error);
			throw error;
		}
		}

	async getCurrentUser() {
		try {
			if (this.getIsLogged())
			{
				await this.RequestCurrentUser();
				const userStr = sessionStorage.getItem("LoggedUser");
				if (userStr)
					return JSON.parse(userStr);
			}
			return null;
		} catch (error) {
			console.error("Error during getCurrentUser:", error);
      		throw error;
		}
	}

	getCurrentUserPlay() {
		try {
			if (this.getIsLogged())
			{
				this.RequestCurrentUser();
				const userStr = sessionStorage.getItem("LoggedUser");
				if (userStr)
					return JSON.parse(userStr);
				return null;
			}
		} catch (error) {
			console.error("Error during getCurrentUser:", error);
      		throw error;
		}
	}

	getAuthToken() {
		const authToken: RawAxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		return authToken;
	}

	getIdFromToken() {
		const cookie = document.cookie
		const tokenData: tokenData = jwtDecode(cookie);
		return tokenData.id;
	}
}
const authService = new AuthService();

export default authService;
