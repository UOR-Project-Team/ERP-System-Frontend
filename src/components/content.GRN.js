import React, { useEffect, useState } from 'react';
import Select from "react-select";
import grnServices from '../services/services.grn';
import DeleteLogo from './../assets/icons/delete.png';

function GRN() {

  const [grnNumber, setgrnNumber] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedSupplierMobile, setSelectedSupplierMobile] = useState('');
  const [selectedSupplierEmail, setSelectedSupplierEmail] = useState('');
  const [items, setSupplierItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [purchasePrice, setPurchasePrice] = useState(null);
  const [SelectedItems, setSelectedItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    generateRandomNumber();
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const suppliers = await grnServices.getAllSuppliers();
      setSuppliers(suppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error.message);
    }
  };

  const fetchItems = async () => {
    try {
      const items = await grnServices.getItems(selectedSupplierId);
      setSupplierItems(items);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  const handlePurchasePriceChange = (event) => {
    const newValue = event.target.value;
    setPurchasePrice(newValue);
  };

  const handleQunatityChange = (event) => {
    const newValue = event.target.value;
    setQuantity(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = {
      itemId: selectedItemId,
      purchasePrice: purchasePrice,
      quantity: quantity
    }

    setSelectedItems((prevItems) => [...prevItems, newItem]);

  }

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.itemId !== itemId)
    );
  };

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
    setgrnNumber('G' + randomNumber.toString());
  }  

  return (
    <div className='grn-container'>
      <div className='grn-content'>
          <span className='content1-left'>
            <div className='content1-container'>
              <span className='content-left'>Supplier Name :</span>
              <span className='content-right'>
                <Select className='select-box'
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: '32px',
                      height: 'auto',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      padding: '0 5px',
                    }),
                    input: (provided) => ({
                      ...provided,
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      width: '26px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: 'hotpink',
                      primary: 'grey',
                    },
                  })}
                  options={suppliers.map((supplier) => ({
                    id: `${supplier.ID}`,
                    contactNo: `${supplier.ContactNo}`,
                    email: `${supplier.Email}`,
                    value: `${supplier.ID} ${supplier.Fullname} ${supplier.ContactNo} ${supplier.Email}`,
                    label: `${supplier.Fullname}`,
                  }))}
                  placeholder="Insert supplier detail"
                  onChange={(selectedOption) => {
                    const selectedSupplierId = selectedOption ? selectedOption.id : null;
                    const selectedSupplierMobile = selectedOption ? selectedOption.contactNo : null;
                    const selectedSupplierEmail = selectedOption ? selectedOption.email : null;
                    setSelectedSupplierId(selectedSupplierId);
                    setSelectedSupplierMobile(selectedSupplierMobile);
                    setSelectedSupplierEmail(selectedSupplierEmail);
                    fetchItems();
                  }}
                />
              </span>
            </div>
            <div className='content1-container'>
              <span className='content-left'>Supplier Email :</span>
              <span className='content-right'><input type='text' name='Email' value={selectedSupplierEmail} disabled placeholder='xxxxxxxxxx' /></span>
            </div>
          </span>
          <span className='content1-right'>
          <div className='content1-container'>
              <span className='content-left'>GRN Number :</span>
              <span className='content-right'><input type='text' name='grnNo' value={grnNumber} disabled /></span>
            </div>
            <div className='content1-container'>
              <span className='content-left'>Supplier Mobile :</span>
              <span className='content-right'><input type='text' name='ContactNo' value={selectedSupplierMobile} disabled placeholder='xxxxxxxxxx' /></span>
            </div>
            
          </span>
      </div>
      <form className='grn-content'>
          <span className='content1-left'>
            <div className='content1-container'>
              <span className='content-left'>Item Name :</span>
              <span className='content-right'>
                <Select className='select-box'
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: '32px',
                      height: 'auto',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      padding: '0 5px',
                    }),
                    input: (provided) => ({
                      ...provided,
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      width: '26px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: 'hotpink',
                      primary: 'grey',
                    },
                  })}
                  options={items.map((item) => ({
                    id: `${item.ID}`,
                    value: `${item.ID}`,
                    label: `${item.Name}`,
                  }))}
                  placeholder="Insert item detail"
                  onChange={(selectedOption) => {
                    const selectedIemId = selectedOption ? selectedOption.id : null;
                    setSelectedItemId(selectedIemId);
                  }}
                />
              </span>
            </div>
            <div className='content1-container'>
              <span className='content-left'>Quantity :</span>
              <span className='content-right'><input type='number' name='quantity' value={quantity} onChange={handleQunatityChange} placeholder='xxxx' /></span>
            </div>
          </span>
          <span className='content1-right'>
            <div className='content1-container'>
              <span className='content-left'>Purchase price :</span>
              <span className='content-right'><input type='number' name='grnNo' value={purchasePrice} onChange={handlePurchasePriceChange} placeholder='xxxxx.xx' /></span>
            </div>
            <div className='content1-container'>
              <span className='content-left'>
                <button type='submit' onClick={handleSubmit}>Add</button>
              </span>
            </div>
          </span>
      </form>
      <div className='grn-content'>
        <table>
          <thead>
            <tr>
              <th className='id'>No</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Purchase Price</th>
              <th>Quantiy</th>
              <th>Total Price</th>
              <th className='action'></th>
            </tr>
          </thead>
          <tbody>
              {SelectedItems.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
                </tr>
              ) : (
                SelectedItems.map((selectedItem, index) => (
                  <tr key={selectedItem.itemId}>
                    <td>{index + 1}</td>
                    {items.map((item) => {
                      if (item.ID == selectedItem.itemId) {
                        return (
                          <React.Fragment key={item.ID}>
                            <td>{item.Code}</td>
                            <td>{item.Name}</td>
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                    <td className='price'>{'Rs ' + selectedItem.purchasePrice}</td>
                    <td>{selectedItem.quantity}</td>
                    <td className='price'>{'Rs ' + selectedItem.quantity * selectedItem.purchasePrice}</td>
                    <td>
                      <button onClick={() => handleRemoveItem(selectedItem.itemId)}>
                        <img src={DeleteLogo} alt='Action Logo' />
                      </button>
                    </td>
                  </tr>
                ))
                
              )}
            </tbody>
        </table>
      </div>
      <div className='grn-content' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className='value-container' >
          <div className='value-content'>
            <span>Sub Total: </span>
            <input type='text' name='sub-total' value={subTotal} disabled />
          </div>
          <div className='value-content'>
            <span>Discount: </span>
            <input type='text' name='dscount' value={discount} />
          </div>
          <div className='value-content'>
            <span>Total Amount: </span>
            <input type='text' name='total-amount' value={totalAmount} disabled />
          </div>
        </div>
      </div>
      <div className='grn-content' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className='button-container' >
          <button style={{ backgroundColor: 'green' }}>Save</button>
          <button style={{ backgroundColor: '#2a6592' }}>Save & Print</button>
          <button style={{ backgroundColor: 'crimson' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default GRN;
