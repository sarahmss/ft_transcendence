import { ReactElement } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import TrendingDown from 'mdi-material-ui/TrendingDown'
import TimelineIcon from '@mui/icons-material/Timeline';
import DotsVertical from 'mdi-material-ui/DotsVertical'
import IUserStats from '../../../../types/user.type'

type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

interface StatisticsCardProps {
	userStats: IUserStats | null
}

const buildStatsData = (userStats: IUserStats | null): DataType[] => {
  return [
    {
      stats: userStats?.matches || '0',
      color: 'info',
      title: 'Matches',
      icon: <TimelineIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: userStats?.victories || '0',
      title: 'Victories',
      color: 'success',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: userStats?.defeats || '0',
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

const StatisticsCard: React.FC<StatisticsCardProps> = ({ userStats }) => {
  const StatsData = buildStatsData(userStats);

  return (
    <Card>
      <CardHeader
        title='Personal History'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              You played {userStats?.matches} matches
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
