import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {AppBar, Toolbar, Typography, Button, Container} from '@material-ui/core'
import {
  MuiThemeProvider,
  createTheme,
  makeStyles,
} from '@material-ui/core/styles'
import StudentTable from '../StudentTable/StudentTable.component'
import LateReportModal from '../LateReportModal/LateReportModal.component'
import {
  fetchTableData,
  submitLateReport,
  createStudentAndSubmitLateReport,
} from '../../utils/httpUtil'
import {connectWithState} from '../../context/StateContext'
import {httpStatus, spacing} from '../../constants'

const theme = createTheme({
  palette: {
    primary: {
      main: '#fc4d54',
    },
  },
  typography: {
    useNextVariants: true,
  },
})

const useStyles = makeStyles(selectedTheme => ({
  header: {
    marginBottom: selectedTheme.spacing(spacing.spacing3x),
  },
  title: {
    marginRight: 'auto',
  },
  container: {
    minHeight: '100vh',
  },
}))

/**
 * Main component that handles all network and rendering logic
 */
export const Main = ({updateState, state}) => {
  const {
    modalOpen,
    loadingStudents,
    submittingLateReport,
    student,
    submittingNewUser,
    serverError,
  } = state
  const styles = useStyles()

  const fetchTableDataSuccess = ({students, teachers}) => {
    updateState({
      ...state,
      students,
      teachers,
      loadingStudents: false,
      loadingStudentsError: false,
    })
  }

  const fetchTableDataFailure = error => {
    updateState({
      ...state,
      loadingStudents: false,
      loadingStudentsError: error.code === httpStatus.ERROR ? false : error,
      serverError: error.code === httpStatus.ERROR ? error.message : false,
    })
  }

  useEffect(() => {
    if (loadingStudents) {
      const fetchData = async () => {
        await fetchTableData(fetchTableDataSuccess, fetchTableDataFailure)
      }
      fetchData()
    }
    // eslint-disable-next-line
  }, [loadingStudents])

  const submitSuccess = () => {
    toggleModal({
      submittingLateReport: false,
      submittingNewUser: false,
      loadingStudents: true,
    })
  }

  const submitFailure = error => {
    updateState({
      ...state,
      submittingLateReport: false,
      submittingNewUser: false,
      submittingError: error,
    })
  }

  useEffect(() => {
    if (submittingLateReport) {
      const saveLateReport = async () => {
        await submitLateReport(student.email, submitSuccess, submitFailure)
      }
      saveLateReport()
    }
    // eslint-disable-next-line
  }, [submittingLateReport])

  useEffect(() => {
    if (submittingNewUser) {
      const submitNewUser = async () => {
        await createStudentAndSubmitLateReport(
          {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            teacherEmail: student.HomeRoomTeacher.email,
          },
          submitSuccess,
          submitFailure,
        )
      }
      submitNewUser()
    }
    // eslint-disable-next-line
  }, [submittingNewUser])

  const toggleModal = (extra = {}) => {
    updateState({
      ...state,
      student: null,
      modalOpen: !modalOpen,
      newFile: false,
      file: null,
      noUserError: false,
      newUser: false,
      loadingStudentsError: false,
      submittingError: false,
      ...extra,
    })
  }
  return (
    <MuiThemeProvider theme={theme}>
      {serverError ? (
        <p>{serverError}</p>
      ) : (
        <>
          <AppBar position="static" className={styles.header}>
            <Toolbar>
              <Typography variant="h6" className={styles.title}>
                Attendence Tracker
              </Typography>
              <Button
                color="inherit"
                onClick={toggleModal}
                data-dom-id="new-late-report-button"
              >
                + New Late Report
              </Button>
            </Toolbar>
          </AppBar>
          <Container className={styles.container}>
            <StudentTable />
            <LateReportModal onClose={toggleModal} />
          </Container>
        </>
      )}
    </MuiThemeProvider>
  )
}

Main.propTypes = {
  updateState: PropTypes.func.isRequired,
  state: PropTypes.shape({
    modalOpen: PropTypes.bool.isRequired,
    loadingStudents: PropTypes.bool.isRequired,
    submittingLateReport: PropTypes.bool.isRequired,
    student: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      HomeRoomTeacher: PropTypes.shape({
        email: PropTypes.string.isRequired,
      }).isRequired,
    }),
    submittingNewUser: PropTypes.bool.isRequired,
    serverError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }).isRequired,
}

export default connectWithState(Main)
