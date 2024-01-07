import { Component } from "react";
import TransPong from '../assets/home.jpeg';
import "./home.component.css"
type Props = {};

type State = {
	content: string;
}

export default class Home extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			content: "Chat"
		};
	}

	// componentDidMount() {
	// 	UserService.getPublicContent().then(
	// 		response => {
	// 			this.setState({
	// 				content: response.data
	// 			});
	// 		},
	// 		error => {
	// 			this.setState({
	// 				content:
	// 					(error.response && error.response.data) ||
	// 					error.message ||
	// 					error.toString()
	// 			});
	// 		}
	// 	);
	// }


	render() {
		return (
		  <div className="wrapper">
			<div className="image-container">
			  <img
				src={TransPong}
				alt="TransPong"
				style={{ maxWidth: "100%", height: "auto" }}
			  />
			</div>

			<div className="container">
			  <header className="jumbotron">
				<h3>{this.state.content}</h3>
			  </header>
			</div>
		  </div>
		);
	  }
	}
