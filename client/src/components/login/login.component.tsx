import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
// import axios from "axios";
import AuthService from "../../services/auth.service";
import * as Yup from "yup";
import { IntraLoginButton } from "./intraLogin.component";

type Props = {};

type State = {
	redirect: string | null,
	userName: string,
	password: string,
	loading: boolean,
	message: string
};

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

	componentDidMount() {
		const currentUser = AuthService.getCurrentUser();

		if (currentUser) {
			this.setState({ redirect: "/profile" });
		};
	}

	componentWillUnmount() {
		window.location.reload();
	}

	validationSchema() {
		return Yup.object().shape({
			userName: Yup.string().required("This field is required!"),
			password: Yup.string().required("This field is required!"),
		});
		}

	handleLogin = async (formValues:{ userName: string; password: string }) => {
		const { userName, password } = formValues;

		this.setState({
			message: "",
			loading: true
		});

		AuthService.LocalLogin(userName, password).then(
			() => {
				this.setState({
				redirect: "/profile"
				});
			},
			error => {
				const resMessage =
					(error.response &&
					error.response.data &&
					error.response.data.message) ||
					error.message ||
					error.toString();

				this.setState({
					loading: false,
					message: resMessage
				});
				}
			);
			}

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
								<label htmlFor="userName">user name</label>
								<Field name="userName" type="text" className="form-control" />
								<ErrorMessage
									name="userName"
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
