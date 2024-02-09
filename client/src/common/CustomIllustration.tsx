import Table from '../assets/Playing1.png';
// ** React Imports
import { Fragment, ReactNode } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

interface CustomIllustrationsProp {
  image1?: ReactNode
  image2?: ReactNode
}


const Img1 = styled('img')(({ theme }) => ({
  left: '-8%',
  bottom: '-15%',
  position: 'absolute',
  zIndex: -1,

}))


const Img2 = styled('img')(() => ({
  right: "-10%",
  top: '-10%',
  position: 'absolute',
  zIndex: -1,

}))

const CustomIllustration = (props: CustomIllustrationsProp) => {
  const { image1, image2 } = props

  const theme = useTheme()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  if (!hidden) {
    return (
      <Fragment>
        {image1 || <Img1 alt='table1' src={Table} />}
        {image2 || <Img2 alt='table2' src={Table} />}
      </Fragment>
    )
  } else {
    return null
  }
}

export default CustomIllustration


