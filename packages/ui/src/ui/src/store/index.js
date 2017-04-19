import { createStore as reduxStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import api from './api'
import rootReducer from './ducks/index'
import { composeWithDevTools } from 'redux-devtools-extension'

export const createStore = create

function create () {
  return reduxStore(rootReducer, {}, composeWithDevTools(
    applyMiddleware(
      thunkMiddleware.withExtraArgument(api())
    )
  ))
}
