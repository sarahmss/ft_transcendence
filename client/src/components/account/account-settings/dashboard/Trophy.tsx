// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TrophySrc from '../../../../assets/trophy.png';
import TriangleSrc from '../../../../assets/triangle-light.png';
import IUser from '../../../../types/user.type'
// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

interface TrophyProps {
	currentUser: IUser | null
}

const Trophy: React.FC<TrophyProps> = ({ currentUser }) => {

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Welcome {currentUser?.userName}! 🥳</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          Level
        </Typography>
        <Typography variant='h5' sx={{ my: 4, color: '#B700cc' }}>
          42
        </Typography>
        <TriangleImg alt='triangle background' src={TriangleSrc} />
        <TrophyImg alt='trophy' src={TrophySrc} />
      </CardContent>
    </Card>
  )
}

export default Trophy
