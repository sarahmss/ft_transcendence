import { Component, useReducer } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import { Link, Button} from '@mui/material';
import { reducer } from "../common/helper";
import customIcon from '../assets/42logo.svg';
import { IntraloginLink, LocalSigninLink } from "../common/constants";
import './login.component.css'

type Props = {};

type State = {
	redirect: string | null,
	userName: string,
	password: string,
	loading: boolean,
	message: string
};


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
				<Link href={IntraloginLink}>
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
			userName: "",
			password: "",
			loading: false,
			message: ""
		};
	}

	componentWillUnmount() {
		window.location.reload();
	}

	handleLogin = async (formValues: { userName: string; password: string }) => {
		const { userName, password } = formValues;
		try {
			const response = await axios.post(LocalSigninLink, {
				userName,
				password,
			});

		} catch (error) {
			console.error("Login error:", error);
		}
		};

	render() {
		if (this.state.redirect) {
			return <Navigate to={this.state.redirect} />
		}

		const { loading, message } = this.state;

		const initialValues = {
			userName: "",
			password: "",
		};

		return (
			<div className="col-md-12">
				<div className="card-container">
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
								<Field name="userName" type="text" className="form-control" placeholder="User" />
								<ErrorMessage
									name="userName"
									component="div"
									className="alert alert-danger"
								/>
							</div>

							<div className="form-group">
								<Field name="password" type="password" className="form-control" placeholder="Password" />
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
				<p className="lorem">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi laborum ad commodi quos voluptate perspiciatis consectetur a, sapiente nam ab necessitatibus, ipsa quidem? Id aliquam, eligendi quidem dolor perferendis error.</p>
			</div>
		);
	}
}
