import { Line, Pie } from '@ant-design/charts';
import React from 'react'
import   "./style.css"

const Charts = ({sortedTransaction}) => {
    
    
    const data  =  sortedTransaction.map((item) =>  {
        return {date : item.date , amount : item.amount}
    })

    const spendingData = sortedTransaction.filter((transaction) => {
        if(transaction.type === "expense"){
            return {tag:transaction.tag , amount:transaction.amount}
        }
    })

    let newSpending = [{tag:"food" , amount : 0},
                      {tag:"education" , amount : 0},
                      {tag:"office" , amount : 0}     
                      ]

     spendingData.forEach(element => {
          if(element.tag === "food"){
              newSpending[0].amount += element.amount
          }
          else if(element.tag === "education"){
            newSpending[1].amount += element.amount
          }
          else{
            newSpending[2].amount += element.amount
          }
     });
    
    const config = {
        data:data,
        xField: 'date',
        yField: 'amount',
        // width: 500,
        // height: 400,
        // autoFit: true,
        
      };
      const spendingConfig = {
        data:newSpending,
        // width: 500,
        // height: 400,
        // autoFit:true,
        xField: 'date',
        yField: 'amount',
        angleField:"amount",
        colorField:"tag"
        
      };
    
      let chart;
      let pieChart;


  return (  
    <div className='charts-wrapper'>
        <div className='line-chart'>
            <h2>Your Analytics</h2>
            <Line {...config}   onReady={(chartInstance) => (chart = chartInstance)}  />
        </div>
        <div className='pie-chart'>
           <h2>Your Spending</h2>
           <Pie {...spendingConfig}   onReady={(chartInstance) => (pieChart = chartInstance)} />
        </div>
    </div>
  )
}

export default Charts