import React from 'react'
import PropTypes from 'prop-types'
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  createStyles,
} from '@material-ui/core'
import ProgressBar from '../ProgressBar/ProgressBar.component'
import {connectWithState} from '../../context/StateContext'

const useStyles = makeStyles(theme =>
  createStyles({
    table: {
      minWidth: 650,
    },
    evenRow: {
      backgroundColor: theme.palette.primary.main,
    },
    evenCell: {
      color: theme.palette.primary.contrastText,
    },
    error: {
      color: theme.palette.error.dark,
    },
  }),
)

export const StudentTable = ({state}) => {
  const {students, loadingStudents, loadingStudentsError} = state
  const isEven = index => index % 2 === 0
  const styles = useStyles()

  return (
    <>
      {loadingStudentsError ? (
        <p className={styles.error}>{loadingStudentsError}</p>
      ) : (
        <TableContainer>
          <Table className={styles.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Student Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Last Late</TableCell>
                <TableCell align="center">Lates/Alotted</TableCell>
                <TableCell align="center">Homeroom Teacher</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students &&
                students.map((row, index) => (
                  <TableRow
                    key={row.email}
                    className={isEven(index) ? styles.evenRow : ''}
                  >
                    <TableCell
                      align="center"
                      className={isEven(index) ? styles.evenCell : ''}
                    >{`${row.firstName} ${row.lastName}`}</TableCell>
                    <TableCell
                      align="center"
                      className={isEven(index) ? styles.evenCell : ''}
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={isEven(index) ? styles.evenCell : ''}
                    >
                      {row.lastLate
                        ? new Date(row.lastLate).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={isEven(index) ? styles.evenCell : ''}
                    >
                      {row.latesCount}/{row.latesAllowed}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={isEven(index) ? styles.evenCell : ''}
                    >{`${row.HomeRoomTeacher.firstName} ${row.HomeRoomTeacher.lastName}`}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ProgressBar show={loadingStudents} />
    </>
  )
}

StudentTable.propTypes = {
  state: PropTypes.shape({
    students: PropTypes.arrayOf(
      PropTypes.shape({
        email: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        lastLate: PropTypes.string,
        latesCount: PropTypes.number.isRequired,
        latesAllowed: PropTypes.number.isRequired,
        HomeRoomTeacher: PropTypes.shape({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }),
    ).isRequired,
    loadingStudents: PropTypes.bool.isRequired,
    loadingStudentsError: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }).isRequired,
}

export default connectWithState(StudentTable)
