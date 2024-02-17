import { io } from "socket.io-client";
import { getToken } from "./helper";

export const BackLink = process.env.REACT_APP_BACK_HOST
export const FrontLink = process.env.REACT_APP_FRONT_HOST
export const ChatLink = BackLink + "/room"

export const appSocket = io(`${BackLink}/app`, { withCredentials: true });
export const IntraloginLink = BackLink + "/auth/login"
export const LocalSignupLink = BackLink + "/auth/signup"
export const LocalSigninLink = BackLink + "/auth/signin"
export const UserContentLink = BackLink + "/users/"
export const FriendsLink = BackLink + "/friends/"
export const TwoFaLink = BackLink + "/2fa-auth"
export const GameLink = BackLink + "/game"
export const MessagePostLink = BackLink + "/message"

export const GROUP: number = 1;
export const DIRECT: number = 2;
export const GLOBAL_BLOCK: number = 3;
export const LOCAL_BLOCK: number = 4;

export const TwoFaDisableLink = TwoFaLink + "/disable"
export const TwoFaEnableLink = TwoFaLink + "/enable"
export const TwoFaGenerateLink = TwoFaLink + "/generate"
export const TwoFaLoginLink = TwoFaLink + "/login"

export const pictureStarter = "https://freedesignfile.com/upload/2017/08/astronaut-icon-vector.png";

export const FrontLogin = FrontLink + "/login";
export const FrontGame = FrontLink + "/game";
export const Front2Fa = FrontLink + "/2fa";
export const DefaultPic = "https://ssl.gstatic.com/accounts/ui/avatar_2x.png";
export const DEFAULT_ERROR_MSG = "ooops, something went wrong";

export type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

export type tokenData = {
	id: string;
}

