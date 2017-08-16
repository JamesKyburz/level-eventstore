import React from 'react'
import Instances from '../instances'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../store/ducks/events'
import { css } from 'aphrodite/no-important'
import { NavLink } from 'react-router-dom'
import style from './style'
import baseUrl from '../../base-url'

const mapStateToProps = (state) => ({})
const mapDispatchToProps =
  (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export const Event = connect(
  mapStateToProps,
  mapDispatchToProps
)((props) => (
  <div className='clearfix m0'>
    <div className='col-8 border-bottom mx-auto m0'>
      <div className='flex flex-wrap m0'>
        <p className={css(style.eventName) + ' col-2 p2 m0'}>{props.value.type}</p>
        <p className='border-left m0 col-1 p2 ml2'>{props.seq}</p>
        <p className='border-left m0 col-2 p2 ml2'>{props.value.createdAt}</p>
        <div className='border-left m0 p0 col-3 ml2'>
          <div className='ml2'>
            <Instances data={{ payload: props.value.payload }} expandAll={props.streamId} />
          </div>
        </div>
        {props.streamId
        ? (
          <NavLink className={css(style.button) + ' p2 border-left border-right m0'} to={baseUrl + '/'}>
            Event <strong>→</strong>
          </NavLink>
        ) : (
          <NavLink className={css(style.button) + ' p2 border-left border-right m0'} to={baseUrl + '/stream/' + props.log + '/' + encodeURIComponent(props.value.payload.id)}>
            Follow stream <strong>→</strong>
          </NavLink>
        )}
      </div>
    </div>
  </div>
))
