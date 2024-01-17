// ** React Imports
import React, { useState, ChangeEvent, InputHTMLAttributes, SyntheticEvent, useReducer } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import InputAdornment from '@mui/material/InputAdornment'

import IUser from '../../../types/user.type'
import userService from '../../../services/user.service'

// ** Icons Imports
import { DefaultPic } from '../../../common/constants'
import { reducer } from '../../../common/helper'

const ImgStyled = styled('img')(({ theme }) => ({
	width: 180,
	height: 180,
	marginRight: theme.spacing(6.25),
	borderRadius: theme.shape.borderRadius,
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: React.ElementType; htmlFor?: string }>(
	({ theme }) => ({
		[theme.breakpoints.down('sm')]: {
			width: '100%',
			textAlign: 'center',
		},
	})
)

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
	marginLeft: theme.spacing(4.5),
	[theme.breakpoints.down('sm')]: {
		width: '100%',
		marginLeft: 0,
		textAlign: 'center',
		marginTop: theme.spacing(4),
	},
}))

interface ProfilePicProps {
	setImgSrc: React.Dispatch<React.SetStateAction<{imgSrc: string}>>
	setUrl: React.Dispatch<React.SetStateAction<{imgUrl: string | undefined}>>
}

const ProfilePicComponent: React.FC<ProfilePicProps> = ({ setImgSrc, setUrl }) => {
	const [file, setFile] = useState<File | undefined>(undefined)
	const [selectedFile, setSelectedFile] = useState<boolean>(false)

	const GetFile = (file: ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader()
		const { files } = file.target
		if (files && files.length !== 0) {
			const selected = files[0]
			reader.onload = () => setImgSrc({imgSrc: reader.result as string})
			reader.readAsDataURL(selected)
			setFile(selected)
			setSelectedFile(true)
		}
	}

	const UploadFile = async () => {
		if (file) {
			const formData = new FormData()
			formData.append('file', file)
			const newProfilePic = await userService.uploadProfilePic(file.name, formData)
			setUrl({imgUrl: newProfilePic});
		}
	}

	return (
		<Box display="flex" flexDirection="column" alignItems="right">
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Box display="flex" flexDirection="column" alignItems="center">
						<ButtonStyled
							component='label'
							variant='contained'
							htmlFor='account-settings-upload-image'
							sx={{ backgroundColor: '#B700cc' }}
						>
							Choose file
							<input
								hidden
								type='file'
								onChange={GetFile}
								accept='image/png, image/jpeg'
								id='account-settings-upload-image'
							/>
							<InputAdornment position='end'>
								<IconButton edge='end' aria-label='qrCode' sx={{ color: 'common.white' }}>
									<AddAPhotoOutlinedIcon />
								</IconButton>
							</InputAdornment>
						</ButtonStyled>
					</Box>
				</Grid>
				<Grid item xs={12}>
					<Box display="flex" flexDirection="column" alignItems="center">
						<ButtonStyled
							component='label'
							variant='contained'
							htmlFor='account-settings-upload-image'
							sx={{ backgroundColor: '#B700cc' }}
							onClick={UploadFile}
							disabled={!selectedFile}
						>
							Upload
							<InputAdornment position='end'>
								<IconButton edge='end' aria-label='qrCode' sx={{ color: 'common.white' }}>
									<CloudUploadOutlinedIcon />
								</IconButton>
							</InputAdornment>
						</ButtonStyled>
					</Box>
				</Grid>
			</Grid>
		</Box>
	)
}

interface ChangeProfileProps {
	setName: React.Dispatch<React.SetStateAction<{name: string}>>;
	setEmail: React.Dispatch<React.SetStateAction<{email: string}>>;
	name: string;
	email: string;
}

const ChangeProfileComponent: React.FC<ChangeProfileProps> = ({ setName, setEmail, name, email }) => {
	const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setName({name: event.target.value});
	};

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmail({email: event.target.value});
	};

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
		<Grid container spacing={2}>
			<Grid item xs={12} sm={6}>
			<TextField
				fullWidth
				label='Username'
				placeholder={name}
				defaultValue={name}
				onChange={handleNameChange}
			/>
			</Grid>
			<Grid item xs={12} sm={6}>
			<TextField
				fullWidth
				type='email'
				label='Email'
				placeholder={email}
				defaultValue={email}
				onChange={handleEmailChange}
			/>
			</Grid>
		</Grid>
		</Box>
	);
};

interface TabAccountProps {
	currentUser: IUser | null
}

const TabAccount: React.FC<TabAccountProps> = ({ currentUser }) => {

	const [state, setState] = useReducer(reducer, {
		imgSrc: (currentUser?.profilePicture || DefaultPic),
		imgUrl: (currentUser?.profilePicture || undefined),
		name: (currentUser?.userName || "name"),
		email: (currentUser?.email || "email"),
	});

	return (
		<CardContent>
			<form>
				<Grid container spacing={7}>
					<Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<ImgStyled src={state.imgSrc} alt='Profile Pic' />
							<ProfilePicComponent
								setImgSrc={setState}
								setUrl={setState} />
						</Box>
					</Grid>

					<Grid item xs={12}>
						<ChangeProfileComponent
							setEmail={setState}
							setName={setState}
							name={state.name}
							email={state.email} />
					</Grid>
					<Grid item xs={12}>
						<Button
						variant='contained'
						onClick={() => userService.updateProfile(state.name, state.profilePicture, state.email)}
						sx={{ marginRight: 3.5, backgroundColor: '#B700cc' }}>
							Save Changes
						</Button>
						<ResetButtonStyled
						type='reset'
						variant='outlined'
						color='secondary'>
							Reset
						</ResetButtonStyled>
					</Grid>
				</Grid>
			</form>
		</CardContent>
	);
	}


export default TabAccount
