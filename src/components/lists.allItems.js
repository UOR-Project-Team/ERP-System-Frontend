import React, { useEffect } from 'react';
import ActionLogo from './../assets/icons/action.png';

function AllItemList({ Item, fetchItems, handleActionClick }) {

  useEffect(() => {
    fetchItems('all', 0);   
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Code</th>
          <th>Name</th>
          <th>Category</th>
          <th>Unit</th>
          <th>Supplier</th>
          
          <th className='action-column'></th>
        </tr>
      </thead>
      <tbody>
        {Item.length === 0 ? (
          <tr>
            <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
          </tr>
        ) : (Item.map((item) => (
          <tr key={item.ID}>
            <td>{item.ID}</td>
            <td>{item.Code}</td>
            <td>{item.Name}</td>
            <td>{item.CategoryName}</td>
            <td>{item.UnitName}</td>
            <td>{item.SupplierName}</td>
            <td>
              <button onClick={(event) => { handleActionClick(event, item) }}>
                <img src={ActionLogo} alt='Action Logo' />
              </button>
            </td>
          </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default AllItemList;
