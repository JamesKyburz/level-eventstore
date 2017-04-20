import React from 'react'
import { Switch, Route } from 'react-router'
import { Home } from './home'
import { Stream } from './stream'
import GitHubForkRibbon from 'react-github-fork-ribbon'

const baseUrl = process.env.REACT_APP_BASE_URL || ''

export default () => (
  <div>
    <GitHubForkRibbon
      href='https://github.com/JamesKyburz/level-eventstore'
      color='green'
      target='_blank'
      position='right'>
    Fork me on GitHub
  </GitHubForkRibbon>
    <Switch>
      <Route path={baseUrl + '/stream/:log/:id'} component={Stream} />
      <Route component={Home} />
    </Switch>
  </div>
)
