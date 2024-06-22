import React from 'react'
import "./style.css"
const Button = ({text , onClick , blue , disabled , type}) => {
  return (
    <div className={blue ? "btn btn-blue" : "btn"} onClick={onClick} disabled ={disabled} type = {type} >{text}  </div>
  )
}

export default Button