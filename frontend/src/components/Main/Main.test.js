import React from 'react'
import {shallow, mount} from 'enzyme'
import {Button} from '@material-ui/core'
import {Main} from './Main.component'

jest.mock('../StudentTable/StudentTable.component')
jest.mock('../LateReportModal/LateReportModal.component')

describe('Main component', () => {
  let wrapper
  const props = {
    updateState: jest.fn(),
    state: {
      modalOpen: false,
      loadingStudents: false,
      submittingLateReport: false,
      student: {
        firstName: '',
        lastName: '',
        email: '',
        HomeRoomTeacher: {
          email: '',
        },
      },
      submittingNewUser: false,
      serverError: false,
    },
  }

  beforeEach(() => {
    props.updateState.mockClear()
  })

  it('should render component', () => {
    wrapper = shallow(<Main {...props} />)
    expect(wrapper.length).toEqual(1)
  })

  describe('Fetch Table Data', () => {
    global.fetch = jest.fn()
    beforeEach(() => {
      global.fetch.mockClear()
    })
    afterEach(() => {
      wrapper.unmount()
    })
    const localProps = {
      ...props,
      state: {
        ...props.state,
        loadingStudents: true,
      },
    }
    it('should update state on success', done => {
      global.fetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            json: () =>
              Promise.resolve({
                data: [{firstName: 'Student', lastName: ''}],
              }),
            status: 200,
          }),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            json: () =>
              Promise.resolve({
                data: [{firstName: 'Jane', lastName: 'Doe'}],
              }),
            status: 200,
          }),
        )
      wrapper = mount(<Main {...localProps} />)
      setImmediate(() => {
        expect(localProps.updateState).toHaveBeenCalledTimes(1)
        expect(localProps.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          students: [{firstName: 'Student', lastName: ''}],
          teachers: [{firstName: 'Jane', lastName: 'Doe'}],
          loadingStudents: false,
          loadingStudentsError: false,
        })
        done()
      })
    })

    it('should update state on failure', done => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({error: 'Error retrieving students.'}),
          status: 400,
        }),
      )
      wrapper = mount(<Main {...localProps} />)
      setImmediate(() => {
        expect(localProps.updateState).toHaveBeenCalledTimes(1)
        expect(localProps.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          loadingStudents: false,
          loadingStudentsError: 'Error retrieving students.',
          serverError: false,
        })
        done()
      })
    })

    it('should set server error if status 500', done => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({error: 'Error retrieving students.'}),
          status: 500,
        }),
      )
      wrapper = mount(<Main {...localProps} />)
      setImmediate(() => {
        expect(localProps.updateState).toHaveBeenCalledTimes(1)
        expect(localProps.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          loadingStudents: false,
          loadingStudentsError: false,
          serverError:
            'Something went wrong! Please make sure the backend server is running.',
        })
        done()
      })
    })
  })

  describe('Submit Late Report', () => {
    beforeEach(() => {
      global.fetch.mockClear()
    })
    const localProps = {
      ...props,
      state: {
        ...props.state,
        submittingLateReport: true,
        modalOpen: true,
        student: {
          email: 'john@doe.com',
          firstName: 'John',
          lastName: 'Doe',
          HomeRoomTeacher: {
            email: 'jane@doe.com',
          },
        },
      },
    }
    it('should toggle modal on success', done => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: {},
            }),
          status: 200,
        }),
      )
      wrapper = mount(<Main {...localProps} />)
      setImmediate(() => {
        expect(localProps.updateState).toHaveBeenCalledTimes(1)
        expect(localProps.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          student: null,
          modalOpen: false,
          newFile: false,
          file: null,
          noUserError: false,
          newUser: false,
          loadingStudentsError: false,
          submittingError: false,
          submittingLateReport: false,
          submittingNewUser: false,
          loadingStudents: true,
        })
        done()
      })
    })

    it('should update state on failure', done => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              error: 'Error in submitting late report.',
            }),
          status: 400,
        }),
      )
      wrapper = mount(<Main {...localProps} />)
      setImmediate(() => {
        expect(localProps.updateState).toHaveBeenCalledTimes(1)
        expect(localProps.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          submittingLateReport: false,
          submittingNewUser: false,
          submittingError: 'Error in submitting late report.',
        })
        done()
      })
    })
  })

  describe('Create New User & Submit Late Report', () => {
    beforeEach(() => {
      global.fetch.mockClear()
    })
    afterEach(() => {
      wrapper.unmount()
    })
    const localProps = {
      ...props,
      state: {
        ...props.state,
        submittingNewUser: true,
        modalOpen: true,
      },
    }
    it('should update state on success', done => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: {},
            }),
          status: 200,
        }),
      )
      wrapper = mount(<Main {...localProps} />)
      setImmediate(() => {
        expect(localProps.updateState).toHaveBeenCalledTimes(1)
        expect(localProps.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          student: null,
          modalOpen: false,
          newFile: false,
          file: null,
          noUserError: false,
          newUser: false,
          loadingStudentsError: false,
          submittingError: false,
          submittingLateReport: false,
          submittingNewUser: false,
          loadingStudents: true,
        })
        done()
      })
    })

    it('should update state on failure', done => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              error: 'Error in creating user and submitting late report.',
            }),
          status: 400,
        }),
      )
      wrapper = mount(<Main {...localProps} />)
      setImmediate(() => {
        expect(localProps.updateState).toHaveBeenCalledTimes(1)
        expect(localProps.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          submittingLateReport: false,
          submittingNewUser: false,
          submittingError: 'Error in creating user and submitting late report.',
        })
        done()
      })
    })
  })

  it('should open modal when late report button clicked', () => {
    wrapper = shallow(<Main {...props} />)
    wrapper.find(Button).props().onClick()
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      ...props.state,
      student: null,
      modalOpen: true,
      newFile: false,
      file: null,
      noUserError: false,
      newUser: false,
      loadingStudentsError: false,
      submittingError: false,
    })
  })

  it('should render serverError text if exists', () => {
    const localProps = {
      ...props,
      state: {
        ...props.state,
        serverError: 'Backend is down.',
      },
    }
    wrapper = mount(<Main {...localProps} />)
    expect(wrapper.text()).toEqual('Backend is down.')
    wrapper.unmount()
  })

  it('should toggle modal when late report modal clicked', () => {
    wrapper = shallow(<Main {...props} />)
    wrapper.find('LateReportModal').props().onClose()
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      ...props.state,
      student: null,
      modalOpen: true,
      newFile: false,
      file: null,
      noUserError: false,
      newUser: false,
      loadingStudentsError: false,
      submittingError: false,
    })
  })
})
