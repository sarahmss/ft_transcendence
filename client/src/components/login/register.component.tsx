import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";
import {Button, Card, CardContent, Box} from '@mui/material';
import './css/login.component.css'
import BackgroundIllustration from "../../common/Illustrations/BackgroundIllustration";

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
					"The password must be between 8 and 32 characters.",
					(val: any) =>
						val &&
						val.toString().length >= 8 &&
						val.toString().length <= 32
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
				if (response.data && response.data.message) {
					this.setState({
						message: response.data.message,
						successful: true
					});
				} else {
					this.setState({
						successful: false,
						message: "Unexpected response formata"
					});
				}
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
			<Box>
					
				<Card className="col-md-12" sx={{backgroundColor:'#B700cc'}}>
					<Card className="card-container">
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
												type="password"
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
											<Button
												type="submit"
												className="btn btn-primary btn-block"
												sx={{backgroundColor:'#B700cc', color:'white'}}>
												Signup
											</Button>
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
				</Card>

					<CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
						<p className="lorem">Reflecting on these two and a half years in university feels like unraveling the mystery of life’s number 42. Each challenge, every laugh, and each unanswered question has been a piece of this intriguing puzzle. To family, friends, and ourselves, who sought meaning in every class and experience. May this chapter be remembered as a constant quest, and may the next reveal more answers than questions.</p>
					</CardContent>
				</Card>
                <BackgroundIllustration />
			</Box>
		);
	}
}
