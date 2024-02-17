import Playing1 from '../../assets/Playing1.png';
import Playing2 from '../../assets/Playing2.png'
// ** React Imports
import { Fragment, ReactNode } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

interface PlayingIllustrationsProp {
  image1?: ReactNode
  image2?: ReactNode
}


const Img1 = styled('img')(({ theme }) => ({
  left: '100%',
  bottom: '25%',
  position: 'absolute',
  zIndex: -1,
}))


const Img2 = styled('img')(() => ({
  right: "100%",
  top: '25%',
  position: 'absolute',
  zIndex: -1,
}))

const PlayingIllustration = (props: PlayingIllustrationsProp) => {
  const { image1, image2 } = props

  const theme = useTheme()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  if (!hidden) {
    return (
      <Fragment>
        {image1 || <Img1 alt='Playing1' src={Playing2} />}
        {image2 || <Img2 alt='Playing' src={Playing2} />}
      </Fragment>
    )
  } else {
    return null
  }
}

export default PlayingIllustration


