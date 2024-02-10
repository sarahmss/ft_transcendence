import Astronauta from '../../assets/Astronauta.png';
import Raquete from '../../assets/Raquete.png'
// ** React Imports
import { Fragment, ReactNode } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

interface FooterIllustrationsProp {
  image1?: ReactNode
  image2?: ReactNode
}

const Img1 = styled('img')(() => ({
  left: '0%',
  bottom: '-10%',
  position: 'absolute',
  zIndex: -1,
}))

const Img2 = styled('img')(() => ({
  left: '0%',
  top: '40%',
  position: 'absolute',
  zIndex: -1,
}))

const Img3 = styled('img')(() => ({
  left: '0%',
  top: '10%',
  position: 'absolute',
  zIndex: -1,
}))

const Img4 = styled('img')(() => ({
  right: '0%',
  bottom: '-10%',
  position: 'absolute',
  zIndex: -1,
}))

const Img5 = styled('img')(() => ({
  right: '0%',
  top: '40%',
  position: 'absolute',
  zIndex: -1,
}))

const Img6 = styled('img')(() => ({
  right: '0%',
  top: '10%',
  position: 'absolute',
  zIndex: -1,
}))
const BackgroundIllustration = (props: FooterIllustrationsProp) => {
  const { image1, image2 } = props

  const theme = useTheme()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  if (!hidden) {
    return (
      <Fragment>
        {image1 || <Img1 alt='Astronauta' src={Astronauta} />}
        {image1 || <Img3 alt='Astronauta' src={Astronauta} />}
        {image2 || <Img2 alt='Pong' src={Raquete} />}
        {image1 || <Img4 alt='Astronauta' src={Astronauta} />}
        {image1 || <Img5 alt='Astronauta' src={Raquete} />}
        {image2 || <Img6 alt='Pong' src={Astronauta} />}

      </Fragment>
    )
  } else {
    return null
  }
}

export default BackgroundIllustration


