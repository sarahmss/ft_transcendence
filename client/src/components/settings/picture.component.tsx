import React, { useReducer, useRef } from 'react';
import IUser from '../../types/user.type';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import userService from '../../services/user.service';
import { reducer } from '../../common/helper';

type ProfilePicProps = {
  currentUser: IUser;
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const ProfilePicComponent = ({ currentUser }: ProfilePicProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useReducer(reducer, {
    selectedFile: undefined,
  });

  const handleUpdateProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setState({ selectedFile: file });
	if (state.selectedFile) {
		handleUploadClick()
	}
  };

  const handleChooseFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }

  };

  const handleUploadClick = () => {
	const formData = new FormData();
	formData.append('file', state.selectedFile);
	const newProfilePic = userService.uploadProfilePic(state.selectedFile.name, formData);
  };

  return (
    <div className="md-layout-item">
      <div className="user-avatar-content">
        <img src={currentUser.profilePicture} alt="profile-img" className="profile-img-card" />

        <div className="md-layout-item ">
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleChooseFileClick}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              name="file"
              accept="image/*"
              onChange={handleUpdateProfilePicture}
              ref={fileInputRef}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
