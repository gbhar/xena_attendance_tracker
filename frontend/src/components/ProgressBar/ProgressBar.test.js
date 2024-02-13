import React from 'react'
import {shallow} from 'enzyme'
import {ProgressBar} from './ProgressBar.component'
import {Backdrop} from '@material-ui/core'

describe('ProgressBar component', () => {
  it('should show backdrop when show true', () => {
    const wrapper = shallow(<ProgressBar show={true} />)
    expect(wrapper.find(Backdrop).props().open).toEqual(true)
  })

  it('should not show backdrop when show false', () => {
    const wrapper = shallow(<ProgressBar show={false} />)
    expect(wrapper.find(Backdrop).props().open).toEqual(false)
  })
})
