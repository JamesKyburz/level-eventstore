require('es6-promise').polyfill()

import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/app'
import { createBrowserHistory } from 'history'
import { createStore } from './store'
import * as eventActions from './store/ducks/events'

const history = createBrowserHistory()
const store = createStore()

history.push(window.location.pathname)

store.dispatch(eventActions.logList())
const root = window.document.querySelector('#root')

ReactDOM.render(<App store={store} history={history} />, root)
