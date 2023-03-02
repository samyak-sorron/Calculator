import React from 'react'
import { actions } from './App'

function OperationButton({dispatch,operation}) {
  return (
    <button onClick={()=>dispatch({type:actions.choose_operation,payload:{operation}})}>{operation}</button>

  )
}

export default OperationButton