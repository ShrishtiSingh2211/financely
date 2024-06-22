import React from 'react'
import transaction from "../assets/transactions.svg"

const NoTransaction = () => {
  return (
    <div
      style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        flexDirection:"column",
        marginBottom:"2rem",
        gap:"1rem"
      }}
    >
        <img src={transaction} style={{width:"300px"}} />
        <p style={{textAlign:"center",fontSize:"1.2rem"}} >
            You Have No Transaction Currently
        </p>
    </div>
  )
}

export default NoTransaction