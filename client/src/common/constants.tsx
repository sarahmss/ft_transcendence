export const BackLink = process.env.REACT_APP_BACK_HOST
export const PublicContentLink = BackLink + "/auth";
export const IntraloginLink = BackLink + "/auth/login"
export const LocalSignupLink = BackLink + "/auth/signup"
export const LocalSigninLink = BackLink + "/auth/signin"
export const UserContentLink = BackLink + "/users/"
export const TwoFaLink = BackLink + "/2fa-auth"
export const GameLink = BackLink + "/game"
export const TwoFaDisableLink = BackLink + "/two-factor-auth/disable"
export const TwoFaEnableLink = BackLink + "/two-factor-auth/enable"
export const FrontUrl = process.env.REACT_APP_FRONT_HOST
export const DEFAULT_ERROR_MSG = "ooops, something went wrong";

export type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

export type tokenData = {
	id: string;
}

