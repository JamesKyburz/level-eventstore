import React, { PureComponent } from 'react'
import { Event } from './event'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../store/ducks/events'
import { css } from 'aphrodite/no-important'
import style from './style'

const mapStateToProps = (state) => ({
  logType: state.events.logType,
  events: state.events.events,
  streams: state.events.streams,
  logList: state.events.logList,
  since: state.events.since
})
const mapDispatchToProps =
  (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export const Events = connect(
  mapStateToProps,
  mapDispatchToProps
)(class Events extends PureComponent {
  componentWillMount () {
    let first = true
    const next = () => {
      const props = this.props
      if (first) {
        props.actions.clearEvents()
        props.actions.clearStreams()
        first = false
      }
      const log = props.logType || props.log
      const lastEventSeq = (props.events[0] || {}).seq || 0
      const lastStreamSeq = (props.streams.slice(-1)[0] || {}).seq || 0
      const fetchData = props.streamId
        ? props.actions.streamById(log, props.streamId, lastStreamSeq)
        : props.actions.logStream(log, lastEventSeq)
      fetchData
      .then(() => { if (this.stop) return; this.timer = setTimeout(next, 1000) })
      .catch(() => { if (this.stop) return; this.timer = setTimeout(next, 10000) })
    }
    this.timer = setTimeout(next)
  }
  componentWillUnmount () {
    this.stop = true
    clearTimeout(this.timer)
  }
  render () {
    const props = this.props
    return (
      <div className={css(style.mainColor) + ' fit'}>
        <div className='ml2 clearfix'>
          <div className='col-8 px2 mx-auto'>
            <div className='flex flex-wrap'>
              <h1 className={css(style.title) + (props.streamId ? ' col-12' : ' col-5')} >
                {props.streamId ? 'Level EventStore Stream id ' + decodeURIComponent(props.streamId) : 'Level EventStore Events' }
              </h1>
              {!props.streamId && <p className={css(style.title) + ' col-1 h5 p2'} >
                100 events
              </p>}
              {!props.streamId && <SelectField
                floatingLabelFixed
                value={props.logType}
                onChange={(event, index, value) => props.actions.updateLogType(value)}
                floatingLabelText='Log type?'
                className='col-4'>
                {props.logList.map((type, i) => <MenuItem key={i} primaryText={type} value={type} />)}
              </SelectField>}
              {!props.streamId && <div className='col-2 mx-auto'>
                <TextField
                  floatingLabelFixed
                  onChange={(event, value) => props.actions.updateSince(value)}
                  floatingLabelText='> sequence?'
                  className='ml2'
                  defaultValue={props.since} />
              </div>}
            </div>
          </div>
        </div>
        <div className='clearfix m0'>
          <div className='col-8 border-bottom mx-auto m0'>
            <div className='flex flex-wrap m0'>
              <p className='col-2 p2 m0' style={{color: '#2BD4EE'}}><strong>Event</strong></p>
              <p className='border-left col-1 p2 m0 ml2'><strong>Sequence</strong></p>
              <p className='border-left col-2 p2 m0 ml2'><strong>Created</strong></p>
              <p className='border-left col-3 p2 m0 ml2'><strong>Payload</strong></p>
            </div>
          </div>
        </div>
        <div className={css(style.events) + ' overflow-scroll m0 p0 mx-auto'}>
          {(props.streamId ? props.streams : props.events)
            .map((event, i) => <Event {...event} streamId={props.streamId} log={props.logType || props.log} />)}
        </div>
      </div>
    )
  }
})
