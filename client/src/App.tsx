import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import IUser from './types/user.type';

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import Settings from "./components/settings.component";
import EventBus from "./common/EventBus";

type Props = {};

type State = {
	currentUser: IUser | undefined
}

class App extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.logOut = this.logOut.bind(this);

		this.state = {
			currentUser: undefined,
		};
	}

	// componentDidMount() {
	// 	const user = AuthService.getCurrentUser();
	// 	if (user) {
	// 		this.setState({
	// 			currentUser: user,
	// 		});
	// 	}
	// 	EventBus.on("logout", this.logOut);
	// }

	componentWillUnmount() {
		EventBus.remove("logout", this.logOut);
	}

	logOut() {
		// logout
		this.setState({
			currentUser: undefined,
		});
	}


	render() {
		const { currentUser } = this.state;

		return (
			<div>
				<nav className="navBarTop d-flex justify-content-between">
					<Link to={"/"} className="Transcendence navMenu">
						Transcendence
					</Link>
					{currentUser && (
						<li className="nav-item">
							<Link to={"/user"} className="nav-link">
								User
							</Link>
						</li>
					)}



					{currentUser ? (
						<div className="navbar-nav ml-auto navMenu">
							<li className="nav-item">
								<Link to={"/profile"} className="nav-link">
									{currentUser.username}
								</Link>
							</li>
							<li className="nav-item">
								<a href="/login" className="nav-link" onClick={this.logOut}>
									LogOut
								</a>
							</li>
						</div>
					) : (
						<section className="register">
							<Link to={"/login"} className="navMenu">
								Login
							</Link>
							<Link to={"/register"} className="navMenu">
									Sign Up
							</Link>
						</section>
					)}
				</nav>	

				<div className="container mt-3">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/user" element={<BoardUser />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</div>
			</div>
		);
	}
}

export default App;
