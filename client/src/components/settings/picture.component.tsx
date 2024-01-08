
import	React, { useReducer } from 'react';
import IUser from "../../types/user.type";
import './settings.component.css';
import userService from '../../services/user.service';
import { reducer } from "../../common/helper";

type ProfilePicProps = {
	currentUser: IUser;
};

export const ProfilePicComponent = ({ currentUser }: ProfilePicProps) => {
	  const [state, setState] = useReducer(reducer, {
		selectedFile: undefined,
	});

	const handleUpdateProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setState({ selectedFile: file });
	};

	const handleUploadClick =  () => {
	if (state.selectedFile) {
		console.log(state.selectedFile.name);
		const formData = new FormData();
		formData.append('file', state.selectedFile);
		const newProfilePic = userService.uploadProfilePic(state.selectedFile.name, formData);
		console.log(newProfilePic);
	} else {
		console.error('Please select a file before uploading'); }
	};

	return (
		<div className="md-layout-item">
			<div className="user-avatar-content ">
					<img
						src={currentUser.profilePicture}
						alt="profile-img"
						className="profile-img-card" />

					<div className="md-layout-item md-alignment-center-center">
						<input type="file" name="file" accept="image/*" onChange={handleUpdateProfilePicture}/>
					</div>

					<div className="md-layout-item md-alignment-center-center">
						<button onClick={handleUploadClick}>
							Upload Profile Picture
						</button>
					</div>
			</div>
		</div>
	)
}
