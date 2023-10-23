import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { IntraUserData, UserProfile } from "../../helpers/types.helper"
import { MessagesHelper } from "src/helpers/messages.helpers";


@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, "42") {
	constructor() {
		super({
			clientID: process.env.INTRA_CLIENT_ID,
			clientSecret: process.env.INTRA_CLIENT_SECRET,
			callbackURL: process.env.INTRA_CALLBACK_URL,
			scope: ["public"],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: UserProfile,
	): Promise<IntraUserData> {
		const { id, userName, emails, profilePicture } = profile;
		const user: IntraUserData = {
			externalId: id,
			userName: userName,
			email: emails[0].value,
			profilPicture: profilePicture[0].value,
		};
		if (!user) {
			throw new HttpException(MessagesHelper.INTRA_USER_NOT_FOUND,
									HttpStatus.NOT_FOUND);
		}
		return user;
	}
}
