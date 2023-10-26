import * as session from 'express-session';
import { Request } from 'express';

export enum status {
	ON = 'online',
	OFF = 'offline',
	PLAYING = 'playing',
}

export type IntraUserData = {
	externalId: number;
	userName: string;
	email: string;
	profilePicture: string;
	};

export type UserProfile = {
	id: number;
	userName: string;
	emails: [{ [key: string]: string }];
	profilePicture: [{ [key: string]: string }];
	};

export interface UserRequest extends Request {
	user: any;
}

const TEMP_PROFILE_PICTURE =
'https://freedesignfile.com/upload/2017/08/astronaut-icon-vector.png';

export const UserHelper = {
		TEMP_PROFILE_PICTURE,
	};

export const ftSession = session({
	cookie: { maxAge: 86400000},
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,});
