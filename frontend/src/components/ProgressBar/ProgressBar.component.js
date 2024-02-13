import React from 'react'
import * as PropTypes from 'prop-types'
import {CircularProgress, Backdrop, makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

export const ProgressBar = ({show}) => {
  const styles = useStyles()
  return (
    <Backdrop className={styles.backdrop} open={show}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

ProgressBar.propTypes = {
  show: PropTypes.bool.isRequired,
}

export default ProgressBar
