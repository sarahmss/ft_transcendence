export const PublicContentLink = process.env.REACT_APP_BACK_HOST + "/auth";
export const IntraloginLink = process.env.REACT_APP_BACK_HOST + "/auth/login"
export const LocalSignupLink = process.env.REACT_APP_BACK_HOST + "/auth/signup"
export const LocalSigninLink = process.env.REACT_APP_BACK_HOST + "/auth/signin"
export const UserContentLink = process.env.REACT_APP_BACK_HOST + "/users/"
export const TwoFaLink = process.env.REACT_APP_BACK_HOST + "/two-factor-auth/login?user="
export const FrontUrl = process.env.REACT_APP_FRONT_HOST
export const DEFAULT_ERROR_MSG = "ooops, something went wrong";

export type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
