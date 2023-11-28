import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
// import axios from "axios";
// import { LocalSignupLink } from "../../common/constants";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";

type Props = {};

type State = {
	userName: string,
	email: string,
	password: string,
	passwordConfirm: string,
	successful: boolean,
	message: string
};

export default class Register extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleRegister = this.handleRegister.bind(this);

		this.state = {
			userName: "",
			email: "",
			password: "",
			passwordConfirm: "",
			successful: false,
			message: ""
		};
	}

	validationSchema() {
		return Yup.object().shape({
			userName: Yup.string()
				.test(
					"len",
					"The userName must be between 3 and 20 characters.",
					(val: any) =>
						val &&
						val.toString().length >= 3 &&
						val.toString().length <= 20
				)
				.required("This field is required!"),
			email: Yup.string()
				.email("This is not a valid email.")
				.required("This field is required!"),
			password: Yup.string()
				.test(
					"len",
					"The password must be between 6 and 40 characters.",
					(val: any) =>
						val &&
						val.toString().length >= 6 &&
						val.toString().length <= 40
				)
				.required("This field is required!"),
			passwordConfirm: Yup.string()
			.oneOf([Yup.ref('password')], 'Passwords must match')
			.required('This field is required!'),
		});
	}

	handleRegister =	async (formValues: { userName: string; email: string; password: string; passwordConfirm: string }) =>
	{
		const { userName, email, password, passwordConfirm } = formValues;

		this.setState({
			message: "",
			successful: false
		});
		AuthService.register(
			userName,
			email,
			password,
			passwordConfirm
			).then(
			response => {
				this.setState({
				message: response.data.message,
				successful: true
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
				successful: false,
				message: resMessage
				});
			}
			);
		}

	render() {
		const { successful, message } = this.state;

		const initialValues = {
			userName: "",
			email: "",
			password: "",
			passwordConfirm: "",
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
						validationSchema={this.validationSchema}
						onSubmit={this.handleRegister}
					>
						<Form>
							{!successful && (
								<div>
									<div className="form-group">
										<label htmlFor="userName"> user name </label>
										<Field name="userName" type="text" className="form-control" />
										<ErrorMessage
											name="userName"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<label htmlFor="email"> Email </label>
										<Field name="email" type="email" className="form-control" />
										<ErrorMessage
											name="email"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<label htmlFor="password"> Password </label>
										<Field
											name="password"
											type="password"
											className="form-control"
										/>
										<ErrorMessage
											name="password"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<label htmlFor="passwordConfirm"> PasswordConfirm </label>
										<Field
											name="passwordConfirm"
											type="passwordConfirm"
											className="form-control"
										/>
										<ErrorMessage
											name="passwordConfirm"
											component="div"
											className="alert alert-danger"
										/>
									</div>
										<div className="form-group">
										<button type="submit" className="btn btn-primary btn-block">
										<span> Signup </span>
										</button>
										</div>
								</div>
							)}

							{message && (
								<div className="form-group">
									<div
										className={
											successful ? "alert alert-success" : "alert alert-danger"
										}
										role="alert"
									>
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
