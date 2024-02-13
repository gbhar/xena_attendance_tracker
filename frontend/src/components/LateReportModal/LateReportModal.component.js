import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {createStyles, makeStyles, withStyles} from '@material-ui/core/styles'
import {
  DialogContent as MuiDialogContent,
  DialogTitle,
  Dialog,
  IconButton,
  Typography,
  Button,
} from '@material-ui/core'
import {Close as CloseIcon} from '@material-ui/icons'
import ImageSelection from '../ImageSelection/ImageSelection.component'
import UserForm from '../UserForm/UserForm.component'
import {processImage} from '../../utils/httpUtil'
import {connectWithState} from '../../context/StateContext'
import {spacing} from '../../constants'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(spacing.spacing2x),
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(spacing.spacing1x),
      top: theme.spacing(spacing.spacing1x),
      color: theme.palette.primary.contrastText,
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
    },
    error: {
      color: theme.palette.error.dark,
      textAlign: 'center',
    },
  }),
)

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(spacing.spacing2x),
  },
}))(MuiDialogContent)

export const LateReportModal = ({state, updateState, onClose}) => {
  const {
    file,
    newFile,
    processing,
    noUserError,
    loadingStudents,
    teachers,
    student,
    modalOpen,
  } = state
  const styles = useStyles()

  const processSuccess = data => {
    updateState({
      ...state,
      student: data,
      processing: false,
      newFile: false,
      newUser: false,
    })
  }

  const processFailure = error => {
    updateState({
      ...state,
      student: null,
      processing: false,
      newFile: false,
      newUser: false,
      noUserError: error,
    })
  }

  useEffect(() => {
    if (processing) {
      const fetchData = async () => {
        await processImage(file, processSuccess, processFailure)
      }
      fetchData()
    }
    // eslint-disable-next-line
  }, [processing])

  useEffect(() => {
    if (loadingStudents) {
      updateState({
        ...state,
        file: null,
      })
    }
    // eslint-disable-next-line
  }, [loadingStudents])

  const createNewUser = () => {
    updateState({
      ...state,
      noUserError: false,
      newFile: false,
      newUser: true,
      student: {
        firstName: '',
        lastName: '',
        email: '',
        HomeRoomTeacher: teachers[0],
      },
    })
  }

  const showUserForm = () => {
    if (processing || newFile) {
      return false
    }
    return student
  }

  return (
    <Dialog onClose={onClose} open={modalOpen} fullWidth>
      <DialogTitle disableTypography className={styles.root}>
        <Typography variant="h6">New Late Report</Typography>
        <IconButton
          aria-label="close"
          className={styles.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <ImageSelection />

        {noUserError && (
          <>
            <p className={styles.error}>{noUserError}</p>
            <div className={styles.buttonGroup}>
              <Button
                variant="contained"
                color="primary"
                data-dom-id="create-new-user-button"
                onClick={createNewUser}
              >
                Create New Student
              </Button>
              <Button
                color="primary"
                onClick={onClose}
                data-dom-id="cancel-button"
              >
                Cancel
              </Button>
            </div>
          </>
        )}

        {showUserForm() && <UserForm />}
      </DialogContent>
    </Dialog>
  )
}

LateReportModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  state: PropTypes.shape({
    file: PropTypes.object,
    newFile: PropTypes.bool.isRequired,
    processing: PropTypes.bool.isRequired,
    noUserError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
      .isRequired,
    loadingStudents: PropTypes.bool.isRequired,
    teachers: PropTypes.array.isRequired,
    student: PropTypes.object,
    modalOpen: PropTypes.bool.isRequired,
  }).isRequired,
}

export default connectWithState(LateReportModal)
