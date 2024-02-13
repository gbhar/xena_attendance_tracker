import {httpStatus} from '../constants'

const HTTP_GET = 'GET'
const HTTP_POST = 'POST'

const baseFetch = async (route, body, method = HTTP_GET) => {
  const result = await fetch(
    `${process.env.REACT_APP_API_URI ?? ''}/api${route}`,
    {
      method,
      cache: 'no-cache',
      headers: {
        'Access-Control-Allow-Origin': '*',
        ...(body instanceof FormData
          ? {}
          : {'Content-Type': 'application/json'}),
      },
      body: body instanceof FormData ? body : JSON.stringify(body),
    },
  ).catch(() => ({status: httpStatus.ERROR}))
  if (result.status === httpStatus.ERROR) {
    return Promise.reject({
      code: httpStatus.ERROR,
      message:
        'Something went wrong! Please make sure the backend server is running.',
    })
  }
  const json = await result.json()
  if (json.data) {
    return json.data
  } else {
    return Promise.reject(json.error)
  }
}

export const processImage = async (file, success, failure) => {
  const formData = new FormData()
  formData.append('student-id', file)

  try {
    const result = await baseFetch('/process-image', formData, HTTP_POST)
    success(result)
  } catch (e) {
    failure(e)
  }
}

export const fetchTableData = async (success, failure) => {
  try {
    const students = await baseFetch('/students')
    const teachers = await baseFetch('/teachers')
    success({students, teachers})
  } catch (e) {
    failure(e)
  }
}

export const submitLateReport = async (email, success, failure) => {
  try {
    const result = await baseFetch(
      '/students/late',
      {
        email,
        lastLate: new Date().toISOString(),
      },
      HTTP_POST,
    )
    success(result)
  } catch (e) {
    failure(e)
  }
}

export const createStudentAndSubmitLateReport = async (
  {firstName, lastName, email, teacherEmail},
  success,
  failure,
) => {
  try {
    const result = await baseFetch(
      '/students',
      {
        firstName,
        lastName,
        email,
        lastLate: new Date().toISOString(),
        latesCount: 1,
        latesAllowed: 5,
        homeRoomTeacherEmail: teacherEmail,
      },
      HTTP_POST,
    )
    success(result)
  } catch (e) {
    failure(e)
  }
}
