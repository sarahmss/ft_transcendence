import axios, { RawAxiosRequestHeaders }  from "axios";
import { BackLink, LocalSigninLink,
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
				if (response.data.accessToken)
				{
					localStorage.setItem("accessToken", response.data.accessToken);
					localStorage.setItem("id", response.data.id);
					localStorage.setItem("Logged","local");
				}
				return response.data;
			});
	}

	IntraLogin() {
		localStorage.setItem("Logged","intra");
	}

	logout() {
		const authToken = this.getAuthToken();
		localStorage.removeItem("LoggedUser");
		return axios.get(BackLink + "/auth/logout", { headers: authToken })
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
		if (this.getIsLogged() === "local") {
			const authToken: RawAxiosRequestHeaders = {'Authorization': 'Bearer ' + localStorage.getItem("accessToken")};
			return authToken;
		} else if (this.getIsLogged() === "intra") {
			const authToken: RawAxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
			return authToken;
		}
	}

	getIdFromToken() {
		if (this.getIsLogged() === "local") {
			return localStorage.getItem("id");
		} else if (this.getIsLogged() === "intra")
		{
			const cookie = document.cookie
			const tokenData: tokenData = jwtDecode(cookie);
			return tokenData.id;
		}
	}
}

export default new AuthService();
