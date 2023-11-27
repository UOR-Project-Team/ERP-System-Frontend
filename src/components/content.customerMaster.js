import React from 'react';

function CustomerMaster() {
  return (
    <div>
      <div className='master-content'>
        <h2>Customer Master</h2>
      </div>
      <div className='master-content'>
        <div className='form-container'>
          <form>
            <table>
              <tbody>
                <tr className='row-full'>
                  <th colSpan="2">Full Name *</th>
                </tr>
                <tr className='row-full'>
                  <td colSpan='2'><input type="text" /></td>
                </tr>
                <tr className='row-full'>
                  <th colSpan="2">Email *</th>
                </tr>
                <tr className='row-full'>
                  <td colSpan="2"><input type="text" /></td>
                </tr>
                <tr className='row-half'>
                  <th>Contact *</th>
                  <th>FAX *</th>
                </tr>
                <tr className='row-half'>
                  <td><input type="text" /></td>
                  <td><input type="text" /></td>
                </tr>
                <tr className='row-half'>
                  <th>Address *</th>
                  <th>TAX</th>
                </tr>
                <tr className='row-half'>
                  <td><input type="text" /></td>
                  <td><input type="text" /></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerMaster;
