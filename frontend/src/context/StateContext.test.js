import React from 'react'
import {mount} from 'enzyme'
import {connectWithState, StateProvider} from './StateContext'
import {DEFAULT_STATE} from './DefaultState'

describe('State Provider', () => {
  const TestComponent = jest.fn(props => {
    return (
      <button
        id="test"
        onClick={() => props.updateState({user: 'user_data'})}
      />
    )
  })

  beforeEach(() => {
    TestComponent.mockClear()
  })

  it('should connect state to component', () => {
    const WrappedComponent = connectWithState(TestComponent)
    const wrapper = mount(
      <StateProvider>
        <WrappedComponent />
      </StateProvider>
    )
    expect(TestComponent).toHaveBeenCalledTimes(1)
    expect(TestComponent.mock.calls[0][0].state).toMatchObject(DEFAULT_STATE)
    expect(
      Object.prototype.hasOwnProperty.call(
        TestComponent.mock.calls[0][0],
        'updateState',
      ),
    ).toEqual(true)
    wrapper.find('button').simulate('click')
    expect(TestComponent).toHaveBeenCalledTimes(2)
    expect(TestComponent.mock.calls[1][0]).toMatchObject({
      state: {
        user: 'user_data',
      },
    })
  })
})
