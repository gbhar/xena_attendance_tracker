import React from 'react'
import PropTypes from 'prop-types'
import {
  makeStyles,
  createStyles,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import {connectWithState} from '../../context/StateContext'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      flexFlow: 'column',
    },
    formField: {
      marginTop: '12px',
    },
    button: {
      margin: '12px auto',
    },
    error: {
      color: theme.palette.error.dark,
    },
  }),
)

export const UserForm = ({state, updateState}) => {
  const {
    student,
    submittingLateReport,
    newUser,
    teachers,
    submittingNewUser,
    submittingError,
  } = state
  const style = useStyles()

  const handleSubmit = e => {
    e.preventDefault()
    updateState({
      ...state,
      ...(newUser
        ? {submittingNewUser: true, submittingError: false}
        : {submittingLateReport: true, submittingError: false}),
    })
  }

  const handleChange = (field, value) => {
    updateState({
      ...state,
      student: {
        ...student,
        ...(field === 'homeroom'
          ? {HomeRoomTeacher: teachers.find(teacher => teacher.email === value)}
          : {[field]: value}),
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className={style.root}>
      <TextField
        id="first-name"
        name="first-name"
        required
        label="First Name"
        disabled={!newUser}
        onChange={e => handleChange('firstName', e.target.value)}
        value={student.firstName}
        className={style.formField}
      />
      <TextField
        id="last-name"
        name="last-name"
        required
        label="Last Name"
        disabled={!newUser}
        onChange={e => handleChange('lastName', e.target.value)}
        value={student.lastName}
        className={style.formField}
      />
      <TextField
        id="email"
        name="email"
        required
        label="Email"
        disabled={!newUser}
        onChange={e => handleChange('email', e.target.value)}
        value={student.email}
        className={style.formField}
      />
      {!newUser ? (
        <TextField
          id="homeroom"
          name="homeroom"
          required
          label="Homeroom Teacher"
          disabled={!newUser}
          value={`${student.HomeRoomTeacher.firstName} ${student.HomeRoomTeacher.lastName}`}
          className={style.formField}
        />
      ) : (
        <FormControl className={style.formField}>
          <InputLabel id="homeroom">Homeroom Teacher</InputLabel>
          <Select
            labelId="homeroom"
            id="homeroom-select"
            value={student.HomeRoomTeacher.email}
            onChange={e => handleChange('homeroom', e.target.value)}
          >
            {teachers.map(teacher => (
              <MenuItem value={teacher.email} key={teacher.email}>
                {teacher.firstName} {teacher.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {submittingError && <p className={style.error}>{submittingError}</p>}

      <Button
        variant="contained"
        color="primary"
        disabled={submittingLateReport || submittingNewUser}
        className={style.button}
        type="submit"
        data-dom-id="submit-late-report-button"
      >
        {submittingLateReport || submittingNewUser ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}

UserForm.propTypes = {
  updateState: PropTypes.func.isRequired,
  state: PropTypes.shape({
    student: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      HomeRoomTeacher: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    submittingLateReport: PropTypes.bool.isRequired,
    newUser: PropTypes.bool.isRequired,
    teachers: PropTypes.arrayOf(
      PropTypes.shape({
        email: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }),
    ).isRequired,
    submittingNewUser: PropTypes.bool.isRequired,
    submittingError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }).isRequired,
}

export default connectWithState(UserForm)
