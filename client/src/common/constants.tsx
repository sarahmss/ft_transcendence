export const BackLink = process.env.REACT_APP_BACK_HOST
export const FrontLink = process.env.REACT_APP_FRONT_HOST

export const IntraloginLink = BackLink + "/auth/login"
export const LocalSignupLink = BackLink + "/auth/signup"
export const LocalSigninLink = BackLink + "/auth/signin"
export const UserContentLink = BackLink + "/users/"
export const TwoFaLink = BackLink + "/2fa-auth"
export const GameLink = BackLink + "/game"
export const ChatLink = BackLink + "/room"
export const MessagePostLink = BackLink + "/message"

export const TwoFaDisableLink = TwoFaLink + "/disable"
export const TwoFaEnableLink = TwoFaLink + "/enable"
export const TwoFaGenerateLink = TwoFaLink + "/generate"
export const TwoFaLoginLink = TwoFaLink + "/login"

export const pictureStarter = "https://freedesignfile.com/upload/2017/08/astronaut-icon-vector.png";

export const FrontLogin = FrontLink + "/login";
export const FrontGame = FrontLink + "/game";
export const DefaultPic = "https://ssl.gstatic.com/accounts/ui/avatar_2x.png";
export const DEFAULT_ERROR_MSG = "ooops, something went wrong";

export type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

export type tokenData = {
	id: string;
}

