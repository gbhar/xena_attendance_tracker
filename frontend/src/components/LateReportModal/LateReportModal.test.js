import React from 'react'
import {mount, shallow} from 'enzyme'
import {Dialog, IconButton, Button} from '@material-ui/core'
import {LateReportModal} from './LateReportModal.component'

jest.mock('../ImageSelection/ImageSelection.component')
jest.mock('../UserForm/UserForm.component')

describe('LateReportModal component', () => {
  let wrapper
  const props = {
    onClose: jest.fn(),
    updateState: jest.fn(),
    state: {
      file: {},
      newFile: false,
      processing: false,
      noUserError: false,
      loadingStudents: false,
      teachers: [],
      student: {},
      modalOpen: true,
    },
  }

  beforeEach(() => {
    props.onClose.mockClear()
    props.updateState.mockClear()
    wrapper = mount(<LateReportModal {...props} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render component', () => {
    expect(wrapper.length).toEqual(1)
  })

  it('should call onClose', () => {
    wrapper.find(Dialog).props().onClose()
    expect(props.onClose).toHaveBeenCalledTimes(1)

    wrapper.find(IconButton).props().onClick()
    expect(props.onClose).toHaveBeenCalledTimes(2)
  })

  it('should show form under right conditions', () => {
    expect(wrapper.find('UserForm').length).toEqual(1)
  })

  describe('no user found', () => {
    const localProps = {
      ...props,
      state: {
        ...props.state,
        noUserError: 'No user found.',
        teachers: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
          },
        ],
      },
    }
    beforeEach(() => {
      wrapper = shallow(<LateReportModal {...localProps} />)
    })
    it('should show error message', () => {
      expect(wrapper.find('p').text()).toEqual('No user found.')
    })

    it('should render 2 buttons', () => {
      expect(wrapper.find(Button).length).toEqual(2)
    })

    it('should create new user when first button clicked', () => {
      wrapper.find(Button).at(0).props().onClick()
      expect(localProps.updateState).toHaveBeenCalledTimes(1)
      expect(localProps.updateState.mock.calls[0][0]).toEqual({
        ...localProps.state,
        noUserError: false,
        newFile: false,
        newUser: true,
        student: {
          firstName: '',
          lastName: '',
          email: '',
          HomeRoomTeacher: {
            firstName: 'Jane',
            lastName: 'Doe',
          },
        },
      })
    })

    it('should close modal when second button clicked', () => {
      wrapper.find(Button).at(1).props().onClick()
      expect(localProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Effects', () => {
    global.fetch = jest.fn()
    beforeEach(() => {
      global.fetch.mockClear()
    })
    it('should call update state when loading students', () => {
      const localProps = {
        ...props,
        state: {
          ...props.state,
          loadingStudents: true,
        },
      }
      wrapper = mount(<LateReportModal {...localProps} />)
      expect(localProps.updateState).toHaveBeenCalledTimes(1)
      expect(localProps.updateState.mock.calls[0][0]).toEqual({
        ...localProps.state,
        file: null,
      })
    })

    it('should call process image and save data when success', done => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({data: {firstName: 'John', lastName: 'Doe'}}),
          status: 200,
        }),
      )
      const localProps = {
        ...props,
        state: {
          ...props.state,
          processing: true,
        },
      }

      wrapper = mount(<LateReportModal {...localProps} />)
      setImmediate(() => {
        expect(props.updateState).toHaveBeenCalledTimes(1)
        expect(props.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          student: {firstName: 'John', lastName: 'Doe'},
          processing: false,
          newFile: false,
          newUser: false,
        })
        done()
      })
    })

    it('should update state error when failure', done => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({error: 'Error processing image.'}),
          status: 400,
        }),
      )
      const localProps = {
        ...props,
        state: {
          ...props.state,
          processing: true,
        },
      }

      wrapper = mount(<LateReportModal {...localProps} />)
      setImmediate(() => {
        expect(props.updateState).toHaveBeenCalledTimes(1)
        expect(props.updateState.mock.calls[0][0]).toEqual({
          ...localProps.state,
          student: null,
          processing: false,
          newFile: false,
          newUser: false,
          noUserError: 'Error processing image.',
        })
        done()
      })
    })
  })
})
