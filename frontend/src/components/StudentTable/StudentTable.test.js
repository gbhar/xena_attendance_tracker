import React from 'react'
import {shallow} from 'enzyme'
import {StudentTable} from './StudentTable.component'
import {TableCell, TableRow} from '@material-ui/core'

describe('StudentTable component', () => {
  let wrapper

  const props = {
    state: {
      students: [
        {
          email: 'john@doe.com',
          firstName: 'John',
          lastName: 'Doe',
          lastLate: '2020-10-10T14:49:32.087Z',
          latesCount: 3,
          latesAllowed: 5,
          HomeRoomTeacher: {
            firstName: 'Betty',
            lastName: 'White',
          },
        },
        {
          email: 'jane@doe.com',
          firstName: 'Jane',
          lastName: 'Doe',
          lastLate: '2020-06-09T14:49:32.087Z',
          latesCount: 2,
          latesAllowed: 5,
          HomeRoomTeacher: {
            firstName: 'Betty',
            lastName: 'White',
          },
        },
      ],
      loadingStudents: false,
      loadingStudentsError: false,
    },
  }

  beforeEach(() => {
    wrapper = shallow(<StudentTable {...props} />)
  })

  it('should render error when error exists', () => {
    const localProps = {
      ...props,
      state: {
        ...props.state,
        loadingStudentsError: 'Error loading students.',
      },
    }

    wrapper = shallow(<StudentTable {...localProps} />)
    expect(wrapper.text()).toContain('Error loading students.')
  })

  describe('Students', () => {
    it('should render number of rows equal to array length', () => {
      expect(wrapper.find(TableRow).length).toEqual(3)
    })

    it('should have even classes for even rows and cells', () => {
      expect(wrapper.find(TableRow).at(1).props().className).toContain(
        'evenRow',
      )
      expect(wrapper.find(TableRow).at(2).props().className).not.toContain(
        'evenRow',
      )
      expect(wrapper.find(TableCell).at(5).props().className).toContain(
        'evenCell',
      )
      expect(wrapper.find(TableCell).at(10).props().className).not.toContain(
        'evenCell',
      )
    })

    it('should render the right name', () => {
      expect(wrapper.find(TableCell).at(5).text()).toEqual('John Doe')
    })

    it('should render the email', () => {
      expect(wrapper.find(TableCell).at(6).text()).toEqual('john@doe.com')
    })

    it('should render last late', () => {
      expect(wrapper.find(TableCell).at(7).text()).toEqual('10/10/2020')
    })

    it('should render late information', () => {
      expect(wrapper.find(TableCell).at(8).text()).toEqual('3/5')
    })

    it('should render homeroom teacher information', () => {
      expect(wrapper.find(TableCell).at(9).text()).toEqual('Betty White')
    })
  })

  it('should render progress bar with right props', () => {
    expect(wrapper.find('ProgressBar').props().show).toEqual(false)
    wrapper.setProps({
      ...props,
      state: {
        ...props.state,
        loadingStudents: true,
      },
    })
    expect(wrapper.find('ProgressBar').props().show).toEqual(true)
  })
})
