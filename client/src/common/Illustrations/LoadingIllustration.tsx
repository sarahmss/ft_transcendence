import LoadingImg from '../../assets/loading.png';
// ** React Imports
import { Fragment, ReactNode } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

interface LoadingIllustrationsProp {
  image1?: ReactNode
  image2?: ReactNode
}


const Img1 = styled('img')(({ theme }) => ({
  left: '0rem',
  bottom: '0rem',
  position: 'absolute',
  zIndex: -1,
}))

const Img2 = styled('img')(() => ({
  right: 0,
  top: '5%',
  position: 'absolute',
  zIndex: -1,
}))

const LoadingIllustration = (props: LoadingIllustrationsProp) => {
  const { image1, image2 } = props

  const theme = useTheme()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  if (!hidden) {
    return (
      <Fragment>
        {image1 || <Img1 alt='Loading1' src={LoadingImg} />}
        {image2 || <Img2 alt='Loading2' src={LoadingImg} />}
      </Fragment>
    )
  } else {
    return null
  }
}

export default LoadingIllustration


