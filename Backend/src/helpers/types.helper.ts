export enum status {
	ON = 'online',
	OFF = 'offline',
	PLAYING = 'playing',
}

export type IntraUserData = {
	externalId: number;
	userName: string;
	email: string;
	profilPicture: string;
	};

export type UserProfile = {
	id: number;
	userName: string;
	emails: [{ [key: string]: string }];
	profilePicture: [{ [key: string]: string }];
	};
