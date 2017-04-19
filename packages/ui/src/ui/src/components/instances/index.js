import React from 'react'
import JSONTree from 'react-json-tree'
import theme from './theme'

export default (props) => <JSONTree
  {
    ...Object.assign({
      invertTheme: false,
      theme: theme,
      hideRoot: true,
      shouldExpandNode: () => !!props.expandAll
    }, props)
  } />
