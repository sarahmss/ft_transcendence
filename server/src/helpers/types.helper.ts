import * as session from 'express-session';
import { Request } from 'express';

export enum status {
	ON = 'Online',
	OFF = 'Offline',
	PLAYING = 'Playing',
}

export enum FriendshipStatus {
	FRIENDS = "Friends",
	SENT = "RequestSent",
	RECEIVED = "RequestReceived",
	DENIED = "RequestDenied",
	REMOVED = "FriendRemoved",
	NOREALATION = "NoRelationship"
}

export type IntraUserData = {
	externalId: number;
	userName: string;
	email: string;
	profilePicture: string;
};

export type LocalUserData = {
	userId: string;
	userName: string;
	email: string;
	// profilePicture: string;
};

export type UserProfile = {
	id: number;
	username: string;
	emails: [{ [key: string]: string }];
	photos: [{ [key: string]: string }];
};

export interface UserRequest extends Request {
	user: any;
	headers: any;
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
