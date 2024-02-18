// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'

import TrophySrc from '../../../assets/trophy.png';
import TriangleSrc from '../../../assets/triangle-light.png';
import IUserStats from '../../../types/userStats.type'

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
	userStats: IUserStats | null
}

const Trophy: React.FC<TrophyProps> = ({ userStats }) => {

  return (
    <Card sx={{ position: 'relative', height: "100%" }}>
      <CardContent>
        <Typography variant='h6'>Welcome to {userStats?.userName} profile! 🥳</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          Play {userStats?.gamesWonToLevelUp || 1} matches to Level Up !!
        </Typography>
        <Typography variant='h5' sx={{ my: 4 }}>
          Level {userStats?.level}
        </Typography>
        <TriangleImg alt='triangle background' src={TriangleSrc} />
        <TrophyImg alt='trophy' src={TrophySrc} />
      </CardContent>
    </Card>
  )
}

export default Trophy
