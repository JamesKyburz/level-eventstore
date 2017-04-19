import React from 'react'
import { Events } from '../events'

export const Stream = (props) => <Events streamId={props.match.params.id} log={props.match.params.log} />
