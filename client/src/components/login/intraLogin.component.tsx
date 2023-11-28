import { useReducer } from "react";
import { Link, Button} from '@mui/material';
import { reducer } from "../../common/helper";
import customIcon from '../../assets/42logo.svg';
import { IntraloginLink } from "../../common/constants";

export const IntraLoginButton = () => {
	const [state, setState] = useReducer(reducer, {
		loading: false,
		loginError: false,
		loginMsg: "Something went wrong",
	});

	const handleLoading = () => {
		setState({ loading: true });
		setTimeout(() => {
			setState({ loading: false });
			setState({ loginError: true });
		}, 7000 )
	}

	return (
		<>
		<div className="form-group">
			<Button
				variant="contained"
				disabled={state.loading}
				onClick={handleLoading}
				size="large"
				>
				<Link href={IntraloginLink}>
					<img src={customIcon} height="24"
							width="24" alt="Icon" />
							Login with 42
				</Link>
			</Button>
		</div>
		</>
	)
}
