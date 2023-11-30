import { Component, useReducer } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { LocalSignupLink } from "../common/constants";
import { Link, Button} from '@mui/material';
import { reducer } from "../common/helper";

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

		try {
			const response = await axios.post(LocalSignupLink, {
				userName: userName,
				email: email,
				password: password,
				passwordConfirm: passwordConfirm
			});
			this.setState({
				message: "Registration successful!",
				successful: true
			});
		} catch (error) {
			console.error("Login error:", error);
			this.setState({
				message: "Registration failed! Please try again.",
				successful: false
			});
		}
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
										<Field name="userName" type="text" className="form-control" placeholder="User" />
										<ErrorMessage
											name="userName"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<Field name="email" type="email" className="form-control" placeholder="e-mail"/>
										<ErrorMessage
											name="email"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<Field
											name="password"
											type="password"
											className="form-control"
											placeholder="password"
										/>
										<ErrorMessage
											name="password"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<Field
											name="passwordConfirm"
											type="passwordConfirm"
											className="form-control"
											placeholder="password confirm"
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
				<p className="lorem">Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi impedit, dolorem id beatae cupiditate aliquid illo dicta, quisquam hic odit deserunt provident vitae repudiandae ratione, magni quos labore veritatis aliquam. Lorem ipsum dolor, sit amet consectetur adipisicing elit. A repellendus accusantium, facilis ab officiis sequi delectus, doloribus dolore porro, temporibus fugiat eaque. Officiis distinctio deserunt fuga aperiam adipisci blanditiis at?</p>
			</div>
		);
	}
}
