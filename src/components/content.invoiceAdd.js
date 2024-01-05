import React , {useEffect , useState , useRef , useCallback } from "react";
import Select from "react-select";
import invoiceServices from "../services/services.invoice";
import DeleteLogo from './../assets/icons/delete.png';



function Invoice(){

  

    const [invoiceNumber , setinvoiceNumber] = useState(0);
    const [customers , setCustomers] = useState([]);
    const [selectedCustomerName , setSelectedCustomerName] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const itemNameInputRef = useRef(null);
    const [price , setPrice] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [cash , setCash] = useState('');
    const [balance , setBalance] = useState(0); 
    
    
    
 

  useEffect(() => {
      generateRandomNumber();
      fetchCustomers();
    }, []);

  useEffect(() => {
      handleQunatityChange();
    }, [quantity]);

  useEffect(() =>{
      fetchItems();
    }, [selectedItemId]); 

  useEffect(() => {
      if (cash === '' || cash === null) {
        setBalance(0);
      }
    }, [cash]);

  useEffect(() => {
      document.getElementById('quantityInput').focus();
    }, [selectedItemId]);

  useEffect(() => {
      calcBalance(totalAmount, cash, discount);
    }, [totalAmount, cash, discount]);

  const handleSelectChange = (selectedOption) => {
      const selectedItemId = selectedOption ? selectedOption.value : null;
      setSelectedItemId(selectedItemId);

      const selectedCustomerName = selectedOption ? selectedOption.Fullname : null;
      const selectedCustomerTitle = selectedOption ? selectedOption.title : null;   
       setSelectedCustomerName(selectedCustomerTitle+selectedCustomerName);
      //console.log('selected item id' , selectedItemId);
   };

  function generateRandomNumber() {
      const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
      setinvoiceNumber('G' + randomNumber.toString());
   }

  const fetchCustomers = async () =>{
      try{
        const customers = await invoiceServices.getAllCustomers();
        setCustomers(customers);   
      }catch(error){
        console.error('error feaching customers:',error.message);
      }
    }

  const fetchItems = async() =>{
      try{
        const items = await invoiceServices.getItems();
        setItems(items);
      }catch (error){
        console.error('error',error.message);
      }
  }

  const handleQunatityChange = (event) => {
      if (!event) {
        return;
      }
      const newValue = parseInt(event.target.value, 10) || '';
        setQuantity(newValue);    
    };

  const fetchPrice = useCallback(async () => {
    try {
      const response = await invoiceServices.getPrice(selectedItemId);
      console.log(response);
      if (Array.isArray(response) && response.length > 0) {
        const unitPrice = response[0].Unit_Price;
        setPrice(unitPrice);
        console.log('Unit Price:', unitPrice);
      } else {
        console.error('Unit Price not found in the response:', response);
      }
    } catch (error) {
      console.error('Error fetching items', error.message);
    }
  }, [selectedItemId, setPrice]);

  useEffect(() => {
    fetchPrice();
  }, [selectedItemId, fetchPrice]);
  

  const handleDiscountChange = (event) => {
      const newValue = event.target.value;
      setDiscount(newValue);
      calcTotal(subTotal, newValue);
  };

  const handleCashChange = (event) => {
      const newValue = event.target.value;
      setCash(newValue);
      calcBalance(totalAmount , newValue);
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
           await fetchPrice(selectedItemId);  
           
           const selectedItem = items.find((item) => item.ID === parseInt(selectedItemId, 10));
             if (!selectedItem) {
              console.error('Item not found for the selected ID:', selectedItemId);
              return;
             }
             if (!quantity || isNaN(quantity)) {
              console.error('Quantity is empty or not a valid number');
              itemNameInputRef.current.focus();
              return;
             }  
            const newItem = {
               itemId: selectedItem.ID,
               itemCode: selectedItem.Code,
               itemName: selectedItem.Name,
               quantity: quantity,
               unitPrice: price,
               totalPrice: quantity*price,
             };

            const updatedItems = [...selectedItems, newItem];
            setSelectedItems(updatedItems);

            const total = calcSubtotal(updatedItems);
            setSubTotal(total);
            calcTotal(total, discount);

            setQuantity('');
            itemNameInputRef.current.focus();
    
            itemNameInputRef.current.focus();
    } catch (error) {
            console.error('Error fetching price:', error.message);
    }
  };
  
  const handleRemoveItem = (index, quantity) => {
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);

      const total = calcSubtotal(updatedItems);
      setSubTotal(total);
      calcTotal(total, discount);
  };

  const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault();
              document.getElementById('quantityInput').focus();
              document.getElementById('cashInput').focus();
              document.getElementById('itemInput').focus();
          }
      };

  const calcSubtotal = (items) => {
      let total = 0;
      items.forEach((selectedItem) => {
        total += selectedItem.quantity * selectedItem.unitPrice;
      });
      return total;
  };

  const calcTotal = (subtotal, discount) => {
      if (discount <= 0) {
        setTotalAmount(subtotal);
      } else if (discount > 0 && discount <= 100) {
        setTotalAmount(subtotal * ((100 - discount) / 100));
      } else if (discount > 100) {
        setTotalAmount(subtotal * 0);
      }
  };

  const calcBalance = (totalAmount, cash ) => {
     if (cash < totalAmount) {
        console.error('Customer needs to pay');
        setBalance(0);
     } else if (cash >= totalAmount) {
        const newBalance = cash - totalAmount;
        setBalance(newBalance);
      } else {
        console.error('Invalid cash amount');
     }
    };
    const handleCancelbutton = () => {
     
      
        
       setSelectedItems([]);
       setSelectedItemId(null);
       setPrice('');
       setSubTotal(0);
       setDiscount('');
       setTotalAmount(0);
       setCash('');
       setBalance(0);
       setQuantity('');
    
    
      
      
    };

return(
    <div className="grn-container">
      <div className="grn-content">
        <span className="content1-left">
          <div className="content1-container">
            <span className="content-left">Customer:</span>
            <span className="content-right">
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
                  
                
                  options={customers.map((customer) => ({
                    id: `${customer.ID}`,
                    title: `${customer.Title}`,
                    contactNo: `${customer.ContactNo}`,
                    Fullname: `${customer.Fullname}`,                  
                     value: `${customer.ContactNo}${customer.Title}${customer.Fullname} `,
                   
                    label: `${customer.Title}${customer.Fullname},${customer.ContactNo}`,
                  }))}
                  placeholder="Insert customer contact number"
                  onChange={handleSelectChange}
                  onKeyDown={handleKeyPress}         
              />
            </span>
          </div>          
        </span>
        <span className='content1-right'>
          <div className='content1-container'>
              <span className='content-left'>Invoice Number :</span>
              <span className='content-right'><input type='text' name='invoiceNo' value={invoiceNumber} disabled /></span>
            </div>
          </span>
      </div>
      <form id="invoiceForm" className='grn-content'>
          <span className='content1-left'>
            <div className='content1-container'>
              <span className='content-left'>Item Name :</span>
              <span className='content-right'>
                <Select
                 id="itemInput"
                  ref={itemNameInputRef}
                className='select-box'
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
                    value: `${item.ID} ${item.Code} ${item.Name}`,
                    label: `${item.Name}`,
                  }))}
                  placeholder="Insert item detail"
                  onChange={handleSelectChange}
                  onKeyPress={handleKeyPress}
                />
              </span>
            </div>       
          </span>
          <span className='content1-right'>
            <div className='content1-container'>
              <span className='content-left'>Quantity :</span>
              <span className='content-right'>
                <input type='number' id='quantityInput' name='quantity' value={quantity} onChange={handleQunatityChange} placeholder='0' /></span>
            </div>
          </span>
          <span className="content-right">
          <div className='content1-container'>
              <span className='content-left'>
                <button type='submit' onClick={handleSubmit}>Add</button>
              </span>
            </div>
          </span>
      </form>
      <div className="grn-content">
        <table>
          <thead>
            <tr>
              <th className="id">No</th>
              <th>Item Code</th>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th className="action"></th>
            </tr>
          </thead>
          <tbody>
              {selectedItems.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ padding: '12px 4px' }}>
                  No data to show
                </td>
              </tr>
               ) : (
              selectedItems.map((selectedItem, index) => (
                <tr key={selectedItem.itemId}>
                  <td>{index + 1}</td>
                  <td>{selectedItem.itemCode}</td>
                  <td>{selectedItem.itemName}</td>
                  <td className="price">{'Rs' + selectedItem.unitPrice}</td>
                  <td className="quantity">{selectedItem.quantity}</td>
                  <td className="price">{'Rs' + selectedItem.totalPrice}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleRemoveItem(index, selectedItem.quantity)
                      }
                    >
                      <img src={DeleteLogo} alt="Action Logo" />
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
            <input type='text' name='sub-total' value={subTotal}  disabled />
          </div>
          <div className='value-content'>
            <span>Discount: </span>
            <input type='text' name='dscount' value={discount} onChange={handleDiscountChange}  onKeyDown={handleKeyPress} />
          </div>
          <div className='value-content'>
            <span>Total Amount: </span>
            <input type='text' name='total-amount' value={totalAmount}  disabled />
          </div>
        </div>
      </div>
      <div className='grn-content' style={{ display: 'flex', justifyContent: 'flex-end' }}>
         <div className="value-container">
              <div className="value-content">
                <span>Cash</span>
                <input id="cashInput" style={{marginRight:'20px'}} type="text" name="cash" value={cash} onChange={handleCashChange} />
                <span>Balance</span>
                <input type="text" name="balance" value={balance} disabled/>
              </div>
         </div>
      </div>
      <div className='grn-content' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className='button-container' >
        <button style={{ backgroundColor: 'crimson' }} onClick={handleCancelbutton}>
            Cancel
          </button>
          
        
          <button style={{ backgroundColor: '#2a6592' }}>Save & Print</button>
          <button style={{ backgroundColor: 'green' }}>Save</button>
        </div>
      </div>

    </div>
  )

}


export default Invoice;