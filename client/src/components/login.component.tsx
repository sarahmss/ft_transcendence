import { Component, useReducer } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import { Link, Button} from '@mui/material';
import customIcon from '../assets/42logo.svg';

const loginLink = process.env.REACT_APP_BACK_HOST + "/auth/login"

type Props = {};

type State = {
	redirect: string | null,
	username: string,
	password: string,
	loading: boolean,
	message: string
};


export const reducer = (state : {[key: string]: any}, newState : {[key: string]: any}) => {
	return {...state, ...newState};
}

const IntraLoginButton = () => {
	const [state, setState] = useReducer(reducer, {
		loading: false,
		loginError: false,
		loginMsg: "Something went wrong",
	});

	const handleLoading = () => {
		setState({ loading: true });
		setTimeout(() => {
			setState({ loading: false });
			setState({ loginError: true });
		}, 7000 )
	}

	return (
		<>
		<div className="form-group">
			<Button
				variant="contained"
				disabled={state.loading}
				onClick={handleLoading}
				size="large"
				>
				<Link href={loginLink}>
					<img src={customIcon} height="24"
							width="24" alt="Icon" />
							Login with 42
				</Link>
			</Button>
		</div>
		</>
	)
}

export default class Login extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleLogin = this.handleLogin.bind(this);

		this.state = {
			redirect: null,
			username: "",
			password: "",
			loading: false,
			message: ""
		};
	}

	// componentDidMount() {
	// 	const currentUser = AuthService.getCurrentUser();

	// 	if (currentUser) {
	// 		this.setState({ redirect: "/profile" });
	// 	};
	// }

	componentWillUnmount() {
		window.location.reload();
	}

	handleLogin = async (formValues: { username: string; password: string }) => {
		const { username, password } = formValues;
		try {
		  const response = await axios.post(loginLink, {
			username,
			password,
		  });

		} catch (error) {

		console.error("Erro ao fazer login:", error);
		}
	  };

	render() {
		if (this.state.redirect) {
			return <Navigate to={this.state.redirect} />
		}

		const { loading, message } = this.state;

		const initialValues = {
			username: "",
			password: "",
		};

		return (
			<div className="col-md-12">
				<div className="card card-container">
					<img
						src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
						alt="profile-img"
						className="profile-img-card"
					/>

					<Formik
						initialValues={initialValues}
						onSubmit={this.handleLogin}
					>
						<Form>
							<div className="form-group">
								<label htmlFor="username">Username</label>
								<Field name="username" type="text" className="form-control" />
								<ErrorMessage
									name="username"
									component="div"
									className="alert alert-danger"
								/>
							</div>

							<div className="form-group">
								<label htmlFor="password">Password</label>
								<Field name="password" type="password" className="form-control" />
								<ErrorMessage
									name="password"
									component="div"
									className="alert alert-danger"
								/>
							</div>

							<div className="form-group">
								<button type="submit" className="btn btn-primary btn-block" disabled={loading}>
									{loading && (
										<span className="spinner-border spinner-border-sm"></span>
									)}
									<span>Login</span>
								</button>
							</div>

							<IntraLoginButton/>
							{message && (
								<div className="form-group">
									<div className="alert alert-danger" role="alert">
										{message}
									</div>
								</div>
							)}
						</Form>
					</Formik>
				</div>
			</div>
		);
	}
}
