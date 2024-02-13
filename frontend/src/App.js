import React from 'react'
import './App.css'
import Main from './components/Main/Main.component'
import {StateProvider} from './context/StateContext'

function App() {
  return (
    <StateProvider>
      <div className="App">
        <Main />
      </div>
    </StateProvider>
  )
}

export default App
