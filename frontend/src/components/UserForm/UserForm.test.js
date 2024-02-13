import React from 'react'
import {shallow} from 'enzyme'
import {UserForm} from './UserForm.component'
import {TextField, Select, MenuItem, Button} from '@material-ui/core'

describe('UserForm component', () => {
  let wrapper
  const props = {
    updateState: jest.fn(),
    state: {
      student: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        HomeRoomTeacher: {
          firstName: 'Betty',
          lastName: 'White',
          email: 'betty@white.com',
        },
      },
      submittingLateReport: false,
      newUser: false,
      teachers: [
        {
          email: 'betty@white.com',
          firstName: 'Betty',
          lastName: 'White',
        },
        {
          email: 'bhav@shah.com',
          firstName: 'Bhav',
          lastName: 'Shah',
        },
      ],
      submittingNewUser: false,
      submittingError: false,
    },
  }

  beforeEach(() => {
    props.updateState.mockClear()
    wrapper = shallow(<UserForm {...props} />)
  })

  it('should render text field for first name with value', () => {
    expect(wrapper.find(TextField).at(0).props().value).toEqual('John')
  })

  it('should render text field for last name with value', () => {
    expect(wrapper.find(TextField).at(1).props().value).toEqual('Doe')
  })

  it('should render text field for email with value', () => {
    expect(wrapper.find(TextField).at(2).props().value).toEqual('john@doe.com')
  })

  it('should call handleChange for all text fields', () => {
    wrapper
      .find(TextField)
      .at(0)
      .props()
      .onChange({
        target: {value: 'TestFirstName'},
      })

    wrapper
      .find(TextField)
      .at(1)
      .props()
      .onChange({
        target: {value: 'TestLastName'},
      })

    wrapper
      .find(TextField)
      .at(2)
      .props()
      .onChange({
        target: {value: 'TestEmail'},
      })

    expect(props.updateState).toHaveBeenCalledTimes(3)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      ...props.state,
      student: {
        ...props.state.student,
        firstName: 'TestFirstName',
      },
    })
    expect(props.updateState.mock.calls[1][0]).toEqual({
      ...props.state,
      student: {
        ...props.state.student,
        lastName: 'TestLastName',
      },
    })
    expect(props.updateState.mock.calls[2][0]).toEqual({
      ...props.state,
      student: {
        ...props.state.student,
        email: 'TestEmail',
      },
    })
  })

  describe('New User', () => {
    const localProps = {
      ...props,
      state: {
        ...props.state,
        newUser: true,
      },
    }
    beforeEach(() => {
      wrapper = shallow(<UserForm {...localProps} />)
    })
    it('should not disable text fields', () => {
      expect(wrapper.find(TextField).at(0).props().disabled).toEqual(false)
    })

    it('should render a dropdown for teachers and have right value', () => {
      expect(wrapper.find(Select).props().value).toEqual('betty@white.com')
      expect(wrapper.find(MenuItem).length).toEqual(2)
      expect(wrapper.find(MenuItem).at(0).props().value).toEqual(
        'betty@white.com',
      )
      expect(wrapper.find(MenuItem).at(0).text()).toEqual('Betty White')
    })

    it('should call handle change', () => {
      wrapper
        .find(Select)
        .props()
        .onChange({
          target: {value: 'bhav@shah.com'},
        })
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0]).toEqual({
        ...localProps.state,
        student: {
          ...localProps.state.student,
          HomeRoomTeacher: {
            firstName: 'Bhav',
            lastName: 'Shah',
            email: 'bhav@shah.com',
          },
        },
      })
    })
  })

  describe('Not New User', () => {
    it('should render text field for homeroom teacher', () => {
      expect(wrapper.find(TextField).at(3).props().value).toEqual('Betty White')
    })

    it('should disable text fields', () => {
      expect(wrapper.find(TextField).at(0).props().disabled).toEqual(true)
      expect(wrapper.find(TextField).at(1).props().disabled).toEqual(true)
      expect(wrapper.find(TextField).at(2).props().disabled).toEqual(true)
      expect(wrapper.find(TextField).at(3).props().disabled).toEqual(true)
    })
  })

  it('should show error if exists', () => {
    const localProps = {
      ...props,
      state: {
        ...props.state,
        submittingError: 'Error submitting form.',
      },
    }
    wrapper.setProps(localProps)
    expect(wrapper.find('p').at(0).text()).toEqual('Error submitting form.')
  })

  it('should disable button and set correct text if loading', () => {
    expect(wrapper.find(Button).text()).toEqual('Submit')
    expect(wrapper.find(Button).props().disabled).toEqual(false)

    const localProps1 = {
      ...props,
      state: {
        ...props.state,
        submittingLateReport: true,
      },
    }
    wrapper.setProps(localProps1)
    expect(wrapper.find(Button).text()).toEqual('Submitting...')
    expect(wrapper.find(Button).props().disabled).toEqual(true)

    const localProps2 = {
      ...props,
      state: {
        ...props.state,
        submittingNewUser: true,
      },
    }
    wrapper.setProps(localProps2)
    expect(wrapper.find(Button).text()).toEqual('Submitting...')
    expect(wrapper.find(Button).props().disabled).toEqual(true)
  })

  it('should submit form', () => {
    const event = {
      preventDefault: jest.fn(),
    }
    wrapper.find('form').props().onSubmit(event)
    expect(event.preventDefault).toHaveBeenCalledTimes(1)
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      ...props.state,
      submittingLateReport: true,
      submittingError: false,
    })

    wrapper.setProps({
      ...props,
      state: {
        ...props.state,
        newUser: true,
      },
    })
    wrapper.find('form').props().onSubmit(event)
    expect(props.updateState.mock.calls[1][0]).toEqual({
      ...props.state,
      newUser: true,
      submittingNewUser: true,
      submittingError: false,
    })
  })
})
