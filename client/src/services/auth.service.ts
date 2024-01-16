import axios, { RawAxiosRequestHeaders }	from "axios";
import { BackLink, LocalSigninLink,
		LocalSignupLink,
		UserContentLink,
		tokenData } from "../common/constants";

import {globalVariable, setGlobalVariable} from "../common/constants";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
class AuthService {

	async LocalLogin(userName: string, password: string) {
		try {
		const response = await axios.post(LocalSigninLink, {
			userName,
			password,
		});

		if (response.data.accessToken) {
			localStorage.setItem("accessToken", response.data.accessToken);
			localStorage.setItem("id", response.data.id);
			localStorage.setItem("Logged", "local");
		}

		return response.data;
		} catch (error) {
		console.error("Error during LocalLogin:", error);
		throw error;
		}
	}

	IntraLogin() {
		localStorage.setItem("Logged", "intra");
	}

	async logout() {
		console.log("Entrou no auth - 3")
		try {
			console.log("Entrou no try do auth - 4")
			const authToken = this.getAuthToken();
			localStorage.clear();
			console.log("limpou o local storage - 6")
			setGlobalVariable("Limpado!")
			console.log(globalVariable);
			await axios.get(BackLink + "/auth/logout", { headers: authToken });
		} catch (error) {
			console.error("Error during logout:", error);
			throw error;
		}
	}

	getIsLogged() {
		const isLogged = localStorage.getItem("Logged");
		return isLogged || null;
	}

	async register(userName: string, email: string, password: string, passwordConfirm: string) {
		try {
			const response = await axios.post(LocalSignupLink, {
			userName,
			email,
			password,
			passwordConfirm: passwordConfirm,
			});
			console.log(response)
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

			localStorage.setItem("LoggedUser", JSON.stringify(response.data));

			return response.data;
		} catch (error) {
			console.error("Error during RequestCurrentUser:", error);
			throw error;
		}
		}

	async getCurrentUser() {

		try {
			if (this.getIsLogged() != null)
			{
				console.log("Entrou no getCurrent user - 7")
				await this.RequestCurrentUser();
				const userStr = localStorage.getItem("LoggedUser");
				if (userStr)
					return JSON.parse(userStr);
				return null;
			}
		} catch (error) {
			console.error("Error during getCurrentUser:", error);
      		throw error;
		}
	}

	getCurrentUserPlay() {
		try {
			if (this.getIsLogged() != null)
			{
				this.RequestCurrentUser();
				const userStr = localStorage.getItem("LoggedUser");
				if (userStr)
					return JSON.parse(userStr);
				return null;
			}
		} catch (error) {
			console.error("Error during getCurrentUser:", error);
      		throw error;
		}
	}

	async getCurrentUserId() {
		const user = await this.getCurrentUser();
		if (user && user.userId)
			return user.userId;
		return "";
	}

	getAuthToken() {
		if (this.getIsLogged() === "local") {
			console.log("entrou no get authtoken - 5")
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
const authService = new AuthService();

export default authService;
