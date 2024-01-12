// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import InputAdornment from '@mui/material/InputAdornment'

import IUser from '../../../types/user.type'
import userService from '../../../services/user.service'

// ** Icons Imports
import { DefaultPic } from '../../../common/constants'

const ImgStyled = styled('img')(({ theme }) => ({
	width: 120,
	height: 120,
	marginRight: theme.spacing(6.25),
	borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
	[theme.breakpoints.down('sm')]: {
		width: '100%',
		textAlign: 'center'
	}
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
	marginLeft: theme.spacing(4.5),
	[theme.breakpoints.down('sm')]: {
		width: '100%',
		marginLeft: 0,
		textAlign: 'center',
		marginTop: theme.spacing(4)
	}
}))

interface TabAccountProps {
	currentUser: IUser | null;
}

const TabAccount: React.FC<TabAccountProps> = ({ currentUser }) => {
	const [imgSrc, setImgSrc] = useState<string>(currentUser?.profilePicture || DefaultPic);
	const [file, setfile] = useState<File | undefined>(undefined);
	const [selectedFile, setSelectedFile] = useState<boolean>(false);


	const GetFile = (file: ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader();
		const { files } = file.target;
		if (files && files.length !== 0) {
			const selected = files[0];
			reader.onload = () => setImgSrc(reader.result as string);
			reader.readAsDataURL(selected);
			setfile(selected);
		setSelectedFile(true);
		}
	}

	const UploadFile = () => {
	if (file)
	{
		const formData = new FormData();
		formData.append('file', file);
		const newProfilePic = userService.uploadProfilePic(file.name, formData);
		console.log(newProfilePic);
	}
	};

	return (
		<CardContent>
			<form>
				<Grid container spacing={7}>
					<Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<ImgStyled src={imgSrc} alt='Profile Pic' />
				<Box><Grid container spacing={2}>
					<Grid item xs={12}>
						<Box display="flex" flexDirection="column" alignItems="center">
						<ButtonStyled
							component='label'
							variant='contained'
							htmlFor='account-settings-upload-image'
							sx={{backgroundColor: '#B700cc'}}
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
						{/* Botão "Upload" */}
						<ButtonStyled
							component='label'
							variant='contained'
							htmlFor='account-settings-upload-image'
							sx={{backgroundColor: '#B700cc'}}
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
						</Box>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField fullWidth label='Username' placeholder='userName' defaultValue='yourName' />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							type='email'
							label='Email'
							placeholder='yourEmail@example.com'
							defaultValue='yourEmail@example.com'
						/>
					</Grid>

					<Grid item xs={12}>
						<Button variant='contained' sx={{ marginRight: 3.5, backgroundColor: '#B700cc'}}>
							Save Changes
						</Button>
						<Button type='reset' variant='outlined' color='secondary'>
							Reset
						</Button>
					</Grid>
				</Grid>
			</form>
		</CardContent>
	)
}

export default TabAccount
