import React, {createContext, useState} from 'react'
import PropTypes from 'prop-types'
import {DEFAULT_STATE} from './DefaultState'

export const StateContext = createContext(DEFAULT_STATE)

const StateProvider = ({children}) => {
  const [state, setState] = useState(DEFAULT_STATE)
  return (
    <StateContext.Provider value={{state, updateState: setState}}>
      {children}
    </StateContext.Provider>
  )
}

const connectWithState = Component => {
  Component.displayName = Component.displayName || Component.name || 'Component'
  // eslint-disable-next-line
  return props => {
    return (
      <StateContext.Consumer>
        {context => {
          return (
            <Component {...context} {...props} />
            )
        }}
      </StateContext.Consumer>
    )
  }
}

StateProvider.propTypes = {
  children: PropTypes.any,
}

export {StateProvider, connectWithState}
