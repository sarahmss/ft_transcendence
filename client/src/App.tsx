import { Component } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/login/login.component";
import Register from "./components/login/register.component";
import Home from "./components/home.component";
import Pong from "./components/game/Pong";
import NavBar from "./components/navBar/NavBar"
import Login2Fa from "./components/login/login2fa.component";
import Logout from "./components/login/logout.component";
import { GameProvider } from './contexts/GameContext';
import AccountSettings from "./components/account/AcountSettings";
import { Provider } from 'react-redux';
import store from './services/store';
import Profile from "./components/profile/Profile";
import Community from "./components/community/Community";
import Error from "./components/error/Error";

type Props = {};

type State = {
}

class App extends Component<Props, State> {

	render() {
		return (

			<div>
				<Provider store ={store}>
					<NavBar/>

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/home" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Logout />} />
						<Route path='/2fa' element={<Login2Fa/>} />
						<Route path="/register" element={<Register />} />
						<Route path="/settings" element={<AccountSettings />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/community" element={<Community />} />
						<Route path="/error" element={<Error />} />
						<Route path="/game" element={
							<div>
									<GameProvider>
										<Pong />
									</GameProvider>
									</div>
								} />
						<Route path="*" element={<Error />} />		
						</Routes>
				</Provider>
			</div>

		);
	}
}

export default App;
