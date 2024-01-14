import React , {useEffect , useState , useRef , useCallback } from "react";
import Select from "react-select";
import invoiceServices from "../services/services.invoice";
import DeleteLogo from './../assets/icons/delete.png';
import { useUser } from '../services/services.UserContext';
import { showErrorToast, showSuccessToast } from "../services/services.toasterMessage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanyLogo from './../assets/logos/Uni_Mart.png';
import {generatePDFInvoice} from "../services/generatePrint";





function Invoice(){

  

    const [invoiceNumber , setinvoiceNumber] = useState(0);
    const [customers , setCustomers] = useState([]);
    const [selectedCustomerName , setSelectedCustomerName] = useState('');
    const [selectedCustomerContact , setSelectedCustomerContact] = useState('');
    const [selectedCustomerId,setSelectedCustomerId] = useState(null);
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
    //const [user, setUser] = useState();

    const {userid, fullname } = useUser();

    const [invoiceData, setInvoiceData] = useState({
      invoiceNumber: '',
      Customerid:'',
      userid: userid,
      solditems :[],
      totalAmount: ''

    })

    const [soldProduct, setsoldProduct] = useState({
      productId: '',
      barcode: '',
      s_price: '',
      quantity: ''
    })

    
    const handleAddItemToInvoice = (itemData) => {
      setInvoiceData(prevState => ({
        ...prevState,
        solditems: [...prevState.solditems, itemData]
      }));
    };

    
 

  useEffect(() => {
      generateRandomNumber();
      fetchCustomers();
    }, []);

  useEffect(() => {
      handleQunatityChange();
      setsoldProduct(prevData => ({
        ...prevData,
        s_price: quantity * price,
      }));
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


    const handleSelectChangeitem = (selectedOption)=>{

      const selectedItemId = selectedOption ? selectedOption.value : null;
      setSelectedItemId(selectedItemId);
    }
  const handleSelectChange = (selectedOption) => {
      
    const selectedC_Id = selectedOption ? selectedOption.value : null;
      console.log('Selected Customer data', selectedC_Id)
      setSelectedCustomerId(selectedC_Id)
      //setSelectedCustomerName(selectedOption.Fullname)
      setSelectedCustomerContact(selectedOption.contactNo)

      setInvoiceData(prevData => ({
        ...prevData,
        Customerid: selectedC_Id,
      }));

       const selectedCustomerName = selectedOption ? selectedOption.Fullname : null;
       const selectedCustomerTitle = selectedOption ? selectedOption.title : null;
        
        setSelectedCustomerName(selectedCustomerTitle+selectedCustomerName);
      
      
   };

  function generateRandomNumber() {
      const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
      setinvoiceNumber('G' + randomNumber.toString());
      setInvoiceData(prevData => ({
        ...prevData,
        invoiceNumber: 'G' + randomNumber.toString()
      }));
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
        //console.log('Items Are',items)
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
        
        setsoldProduct(prevData => ({
          ...prevData,
          quantity: newValue
        }));
    };

  const fetchPrice = useCallback(async () => {
    try {
      const response = await invoiceServices.getPrice(selectedItemId);
      //console.log(response);
      if (Array.isArray(response) && response.length > 0) {
        const unitPrice = response[0].Unit_Price;
        const p_barcode = response[0].Barcode;
        const p_id = response[0].id;
        
        setsoldProduct(prevData => ({
          ...prevData,
          productId: p_id,
          barcode: p_barcode,
        }));
        setPrice(unitPrice);
       // console.log('Unit Price:', unitPrice);
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


            const subtotal = calcSubtotal(updatedItems);

            setSubTotal(subtotal);
            calcTotal(subtotal, discount);
             
            handleAddItemToInvoice(soldProduct);
            setsoldProduct({
              productId: '',
              barcode: '',
              s_price: '',
              quantity: ''
            });
            

            setQuantity('');
            itemNameInputRef.current.focus();
    
            itemNameInputRef.current.focus();
    } catch (error) {
            console.error('Error fetching price:', error.message);
    }
  };

  
  
  const handleRemoveItem = (index, quantity) => {
    console.log('remove Index is ',index)
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);

      //Handel invoice data changes
      setInvoiceData((prevInvoiceData) => {
        const updatedSoldItems = [...prevInvoiceData.solditems];
        if (index >= 0 && index < updatedSoldItems.length) {
          updatedSoldItems.splice(index, 1); // Remove item at indexToRemove
        } else {
          console.error('Invalid index provided');
        }
    
        return {
          ...prevInvoiceData,
          solditems: updatedSoldItems, // Update solditems array in invoiceData
        };
      });

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
      let sub_total = 0;
      items.forEach((selectedItem) => {
        sub_total += selectedItem.quantity * selectedItem.unitPrice;
      });
      return sub_total;
  };

  const calcTotal = (subtotal, discount) => {
      if (discount <= 0) {
        setTotalAmount(subtotal);
        setInvoiceData(prevData => ({
          ...prevData,
          totalAmount: subtotal
        }));

      } else if (discount > 0 && discount <= 100) {
        setTotalAmount(subtotal * ((100 - discount) / 100));

        setInvoiceData(prevData => ({
          ...prevData,
          totalAmount: subtotal * ((100 - discount) / 100)
        }));

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
     
      
       setSelectedItems(null);
       setSelectedItems([]);
       setSelectedItemId(null);
       setPrice('');
       setSubTotal(0);
       setDiscount('');
       setTotalAmount(0);
       setCash('');
       setBalance(0);
       setQuantity('');

       setInvoiceData({
        invoiceNumber: '',
        Customerid:'',
        userid: userid,
        solditems :[],
        totalAmount: ''
       });
       setsoldProduct({
        productId: '',
        barcode: '',
        s_price: '',
        quantity: ''
      });

      
    };

    const handleSavebutton = async(event)=>{

      event.preventDefault();
     //console.log(invoiceData)

     if (
      invoiceData.invoiceNumber.trim() === '' ||
      String(invoiceData.totalAmount).trim() === '' ||
      invoiceData.solditems.length === 0 
    ) {
      showErrorToast('Please fill in all required fields');
      return;
    }

     try{
     const result = await invoiceServices.invoiceList(invoiceData);

     if(result === 201){
          showSuccessToast("Succesfully Updated")

          setSelectedItems([]);
          setSelectedItemId(null);
          setPrice('');
          setSubTotal(0);
          setDiscount('');
          setTotalAmount(0);
          setCash('');
          setBalance(0);
          setQuantity('');
     }else{
          showErrorToast("Faild To Update the Invoice ")
     }

    }catch(error){
      showErrorToast(" Please Try again ")
    }

    }

  const handleExportToPDF = () => {
    
    if (totalAmount === 0) {
           showErrorToast('Cannot generate pdf without Sales');
           console.error('empty');
            return;
          }

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();

      const noteText1 = "Note:";
      const noteText2 = "* Returns are accepted within 7 days of purchase with a valid receipt.";
      const noteText3 = "* Refunds will be issued in accordance with the store's refund policy.";
      const thankYouMessage = 'Thank You! Come Again';
      const noteHeader = "INVOICE"

  
      const pdf = generatePDFInvoice(
        totalAmount,
        invoiceNumber,
        formattedDate,
        formattedTime,
        selectedCustomerName,
        selectedCustomerContact,
        fullname,
        CompanyLogo,
        selectedItems,
        subTotal,
        discount,
        cash,
        balance,
        noteText1,
        noteText2,
        noteText3,
        noteHeader,
        thankYouMessage
    );
    pdf.save("ERP-Invoice.pdf");  
    showSuccessToast('PDF generated successfully');
  };


    
    


return(
  
    <div className="grn-container">
       <ToastContainer />
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
                    //value: `${customer.Title},${customer.Fullname},${customer.ContactNo}`,
                     value: `${customer.ID}`,
                    label: `${customer.Title}. ${customer.Fullname} ,${customer.ContactNo}`,
                  }))}
                  
                  placeholder="Insert customer contact number"
                  onChange={handleSelectChange}
                   //value={selectedCustomerName}
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
                    //value: `${item.ID} ${item.Code} ${item.Name}`,
                    value: `${item.ID}`,
                    label: `${item.Name}`,
                  }))}
                  placeholder="Insert item detail"
                  onChange={handleSelectChangeitem}
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
          
        
          <button style={{ backgroundColor: '#2a6592' }}  onClick={handleExportToPDF}>Save & Print</button>
          <button style={{ backgroundColor: 'green' }} onClick={handleSavebutton}>Save</button>
        </div>
      </div>

      <ToastContainer/>
    </div>
  )

}


export default Invoice;