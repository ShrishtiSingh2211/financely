import React from 'react'
import Button from '../Button'
import "./style.css"
import { Row  , Card } from 'antd'

const Cards = ({showExpenseModal , showIncomeModal , expense , income , totalBalance , showResetModal}) => {
  // console.log(expense , income , totalBalance)
  return (
    <div>
        <Row className='my-row'  >  
          <Card className='my-card'  >
            <h2>Current Balance</h2>
             <p> ₹{totalBalance}</p>
             <Button text = "Reset Balance" blue={true}  onClick={showResetModal} />
          </Card>
          <Card className='my-card' >
             <h2>Total Income</h2>
             <p> ₹{income}</p>
             <Button text = "Add Income" blue={true} onClick={showIncomeModal} />
          </Card>
          <Card className='my-card' >
             <h2>Total Expenses</h2>
             <p> ₹{expense}</p>
             <Button text = "Add Expenses" blue={true} onClick={showExpenseModal} />
          </Card>
        </Row>
    </div>
  )
}

export default Cards