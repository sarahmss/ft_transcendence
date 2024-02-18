import { Component, useReducer } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, Card, CardContent, Box, Button} from '@mui/material';
import { reducer } from "../../common/helper";
import { IntraloginLink } from "../../common/constants";
import './css/login.component.css'
import AuthService from "../../services/auth.service";
import * as Yup from "yup";
import BackgroundIllustration from "../../common/Illustrations/BackgroundIllustration";

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

	async componentDidMount() {
		try {
			const currentUser = await AuthService.getCurrentUser();

			if (currentUser) {
				this.setState({ redirect: "/" });
			};			
		} catch (error) {
			console.error(error);
		}

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

		await AuthService.LocalLogin(
			userName,
			password
			).then(
			response => {
				this.setState({ redirect: "/" });
				document.cookie = response.data.cookie;
				sessionStorage.setItem("Logged", "ok");
			},
			error => {
				if (error.response.status === 307)
				{
					const userId = error.response.data.userId;
					console.log(userId);
					this.setState({ redirect: `/2fa?user=${userId}` });
				} else {
					const resMessage =
						(error.response &&
						error.response.data &&
						error.response.data.message) ||
						error.message ||
						error.toString();

					this.setState({
						loading: false,
						message: resMessage });
					}
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
						<p className="lorem">Reflecting on these two and a half years in university feels like unraveling the mystery of life’s number 42. Each challenge, every laugh, and each unanswered question has been a piece of this intriguing puzzle. To family, friends, and ourselves, who sought meaning in every class and experience. May this chapter be remembered as a constant quest, and may the next reveal more answers than questions.</p>
					</CardContent>
				</Card>
				<Box
                  className="form-group"
                  sx={{
                    margin: '15px',
                    display: 'flex',
                    justifyContent: 'left'
                  }}
                >
                  <BackgroundIllustration />
                </Box>
			</Box>
		);
	}
}
