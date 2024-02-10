import { ReactElement } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import TrendingDown from 'mdi-material-ui/TrendingDown'
import TimelineIcon from '@mui/icons-material/Timeline';
import IUserStats from '../../../types/userStats.type'
import { styled } from '@mui/material/styles'

type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const ImgStyled = styled('img')(({ theme }) => ({
	width: 180,
	height: 180,
	marginRight: theme.spacing(6.25),
	borderRadius: theme.shape.borderRadius,
}))

const buildStatsData = (userStats: IUserStats | null): DataType[] => {
  return [
    {
      stats: userStats?.matches || '0',
      color: 'info',
      title: 'Matches',
      icon: <TimelineIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: userStats?.totalGamesWon || '0',
      title: 'Victories',
      color: 'success',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: userStats?.totalGamesLost || '0',
      title: 'Defeats',
      color: 'error',
      icon: <TrendingDown sx={{ fontSize: '1.75rem' }} />
    }
  ];
}

const renderStats = (StatsData: DataType[]) => {
  return StatsData.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

interface StatisticsCardProps {
	userStats: IUserStats | null,
  profilePic: string
}
const StatisticsCard: React.FC<StatisticsCardProps> = ({ userStats, profilePic }) => {
  const StatsData = buildStatsData(userStats);

  return (
    <Card>
      <CardHeader
        title='Personal History'
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
							<ImgStyled src={profilePic} alt='Profile Pic' />
					</Box>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              {userStats?.userName} played {userStats?.matches} matches
            </Box>{' '}
            😎 
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats(StatsData)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard;
