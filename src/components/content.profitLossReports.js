import React, { useState, useEffect } from 'react';

function ProfitLossReports() {

  const data ={
    "income": [
      { "category": "Salary", "amount": 5000 },
      { "category": "Freelance Income", "amount": 2000 },
      { "category": "Investment Income", "amount": 1000 }
    ],
    "expenses": [
      { "category": "Rent", "amount": 1500 },
      { "category": "Utilities", "amount": 200 },
      { "category": "Groceries", "amount": 300 },
      { "category": "Transportation", "amount": 150 }
    ]
  }

  return (
    <div>
      <table>
        <table>
              <thead>
                <tr>
                  <th>Income</th>
                  <th>$</th>
                  <th className='action-column'></th>
                </tr>
              </thead>
              <tbody>
                {data.income.map((item, index) => (
                  <tr key={`income-${index}`}>
                    <td>{item.category}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
                <tr>
                  <td>Expenses</td>
                  <td></td> {/* Leave this column empty for expenses */}
                </tr>
                {data.expenses.map((item, index) => (
                  <tr key={`expense-${index}`}>
                    <td>{item.category}</td>
                    <td>{item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>
      </table>
    </div>
  );
}

export default ProfitLossReports;
