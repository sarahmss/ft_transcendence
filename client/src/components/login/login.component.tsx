import { Component, useReducer } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, Card, CardContent, Box, Button, Divider} from '@mui/material';
import { reducer } from "../../common/helper";
import { IntraloginLink } from "../../common/constants";
import './css/login.component.css'
import AuthService from "../../services/auth.service";
import * as Yup from "yup";

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

	const theme = createTheme({
		palette: {
		  primary: {
			main: '#ffffff',
		  },
		  secondary: {
			main: '#ffffff',
		  },
		},
	});

	const handleLoading = () => {
		setState({ loading: true });
		setTimeout(() => {
			setState({ loading: false });
			setState({ loginError: true });
		}, 7000 )
		AuthService.IntraLogin();
	}

	return (
		<>
		<div className="form-group ">
			<ThemeProvider theme={theme}>
				<Button
					variant="contained"
					disabled={state.loading}
					onClick={handleLoading}
					size="large"
					style={{minWidth:100}}
					>
					<Link href={IntraloginLink}>
						<span className="span_login">Login with 42</span>
					</Link>
				</Button>
			</ThemeProvider>
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
			<Card className="col-md-12" sx={{backgroundColor:'#B700cc'}}>
				<Card className="card-container">
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

							<Box className="form-group"
								sx={{margin:'10px',
								display: 'flex',
								justifyContent:'center'}}>

								<Button
									type="submit"
									className="btn btn-primary btn-block"
									disabled={loading}
									sx={{backgroundColor:'#B700cc', color:'white'}}>
									Login
									{loading && (
										<span className="spinner-border spinner-border-sm"></span>
									)}
								</Button>

							</Box>
							<Box className="form-group"
								sx={{margin:'15px',
								display: 'flex',
								justifyContent:'center'}}>

								<IntraLoginButton/>
							</Box>

							{message && (
								<div className="form-group">
									<div className="alert alert-danger" role="alert">
										{message}
									</div>
								</div>
							)}

						</Form>
					</Formik>
				</Card>
				<CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
					<p className="lorem">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi laborum ad commodi quos voluptate perspiciatis consectetur a, sapiente nam ab necessitatibus, ipsa quidem? Id aliquam, eligendi quidem dolor perferendis error.</p>
				</CardContent>
			</Card>
		);
	}
}
