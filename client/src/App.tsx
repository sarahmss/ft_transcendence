import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/login/login.component";
import Register from "./components/login/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile/profile.component";
import BoardUser from "./components/profile/board-user.component";
import Settings from "./components/settings/settings.component";
import EventBus from "./common/EventBus";
import { GameProvider } from './contexts/GameContext';
import Pong from "./components/game/Pong";

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

	componentDidMount() {
		const user = AuthService.getCurrentUser();
		if (user) {
			this.setState({
				currentUser: user,
			});
		}
		EventBus.on("logout", this.logOut);
	}

	componentWillUnmount() {
		EventBus.remove("logout", this.logOut);
	}

	logOut() {
		AuthService.logout();
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
									{currentUser.userName}
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
						<Route path="/home" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/user" element={<BoardUser />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/game" element={
									<div>
									<GameProvider>
										<Pong />
									</GameProvider>
									</div>
								} /> </Routes>
				</div>
			</div>
		);
	}
}

export default App;
