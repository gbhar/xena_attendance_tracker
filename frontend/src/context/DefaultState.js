/**
 * Global state for application
 */
export const DEFAULT_STATE = {
  modalOpen: false,
  students: [],
  teachers: [],
  student: null,
  hoverState: false,
  file: null,
  newFile: false,
  newUser: false,
  noUserError: false,

  loadingStudents: true,
  loadingStudentsError: false,
  submittingLateReport: false,
  submittingNewUser: false,
  submittingError: false,
  processing: false,

  serverError: false,
}
