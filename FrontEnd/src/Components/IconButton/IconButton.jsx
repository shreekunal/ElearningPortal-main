import React from 'react'
import './IconButton.css'
import { NavLink } from 'react-router-dom'

const IconButton = ({label, to, className}) => {

  if (!to) {
    return (
      <div className={'icon-button' + (className? ` ${className}` : "")}>
        {label}
      </div>
    )
  }

  return (
      <NavLink to={to} style={{textDecoration: 'none', color: 'inherit'}}
               onDragStart={(e) => e.preventDefault()}>
        <div className={'icon-button' + (className? ` ${className}` : "")}>
          {label}
        </div>
      </NavLink>
  )
}

export default IconButton
