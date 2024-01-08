import { Component } from "react";
import TransPong from '../assets/home.jpeg';
import "./home.component.css"
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import {FrontLogin, FrontGame} from "./../common/constants";

type Props = {};

type State = {
	content: string;
	currentUser: IUser & { accessToken: string };
	isLogged: boolean;
}

export default class Home extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			content: "Chat",
			currentUser: { accessToken: "" },
			isLogged: false,
		};
	}

	componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (currentUser) 
			this.setState({isLogged: true });
		
        this.setState({ currentUser: currentUser})
    }


	render() {
		return (
		  <div className="wrapper">
			<div className="image-container">
			  <img
				src={TransPong}
				alt="TransPong"
				style={{ width: "100%", objectFit: "cover", height: "100%" }}
			  />
			</div>

			<div className="container">
			  <section className="jumbotron">
				<h3>{this.state.content}</h3>
			  </section>
			  {this.state.isLogged ? (
					<a href={FrontGame}>
						<button>Play</button>
					</a>
					) : (
						<a href={FrontLogin}>
							<button>Please, log in!</button>
						</a>
					)}
			</div>
		  </div>
		);
	  }
	}
