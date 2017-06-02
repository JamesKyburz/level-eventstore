import es6promise from 'es6-promise'
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/app'
import { createBrowserHistory } from 'history'
import { createStore } from './store'
import * as eventActions from './store/ducks/events'

es6promise.polyfill()

const history = createBrowserHistory()
const store = createStore()

history.push(window.location.pathname)

store.dispatch(eventActions.logList())
const root = window.document.querySelector('#root')

ReactDOM.render(<App store={store} history={history} />, root)
