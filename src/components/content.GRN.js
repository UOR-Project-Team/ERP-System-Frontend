import React, { useEffect, useState } from 'react';
import Select from "react-select";
import grnServices from '../services/services.grn';
import DeleteLogo from './../assets/icons/delete.png';

import { useUser } from '../services/services.UserContext';
import { showErrorToast, showSuccessToast } from "../services/services.toasterMessage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GRN() {

  const [grnNumber, setgrnNumber] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedSupplierMobile, setSelectedSupplierMobile] = useState('');
  const [selectedSupplierEmail, setSelectedSupplierEmail] = useState('');
  const [items, setSupplierItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [SelectedItems, setSelectedItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [sellingPrice, setsellingPrice] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selecteditemLabel, setSelecteditemLabel] = useState(null);

  const {userid } = useUser();

  const [grnData, setgrnData] = useState({
    grnNo: '',
    supplierid:'',
    userid: userid,
    puchaseditems :[],
    totalAmount: ''

  })

  const [purchasedProduct, setpurchasedProduct] = useState({
    productId: '',
    barcode: '',
    purchase_price: '',
    unitprice: '',
    quantity: ''
  })

  const handleAddItemToInvoice = (itemData) => {
    setgrnData(prevState => ({
      ...prevState,
      puchaseditems: [...prevState.puchaseditems, itemData]
    }));
  };


  useEffect(() => {
    generateRandomNumber();
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(()=>{
    fetchItems();
  },[selectedSupplierId])

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
    setpurchasedProduct(prevData =>({
      ...prevData,
      purchase_price: newValue,
    }))
  };

  const handleSellingPriceChange = (event) =>{
    const newValue = event.target.value;
    setsellingPrice(newValue);
    setpurchasedProduct(prevData =>({
      ...prevData,
      unitprice: newValue,
    }))
  }

  const handleQunatityChange = (event) => {
    const newValue = event.target.value;
    setQuantity(newValue);
    setpurchasedProduct(prevData =>({
      ...prevData,
      quantity: newValue,
    }))
  };

  const handleDiscountChange = (event) => {
    const newValue = event.target.value;
    setDiscount(newValue);
    calcTotal(subTotal, newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      itemId: selectedItemId,
      purchasePrice: purchasePrice,
      quantity: quantity,
      sell_Price: sellingPrice
    }
    const total = calcSubtotal() + (purchasePrice * quantity);
    setSubTotal(total);
    calcTotal(total, discount);
    setSelectedItems((prevItems) => [...prevItems, newItem]);

    handleAddItemToInvoice(purchasedProduct);
    setpurchasedProduct({
      productId: '',
      barcode: '',
      purchase_price: '',
      unitprice: '',
      quantity: '',
    })

    setQuantity('');
    setPurchasePrice('');
    setsellingPrice('');
    setSelecteditemLabel(null);

  }

  const handleRemoveItem = (index, purchasePrice, quantity) => {
    setSelectedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });

    setgrnData((prevInvoiceData) => {
      const updatedSoldItems = [...prevInvoiceData.puchaseditems];
      if (index >= 0 && index < updatedSoldItems.length) {
        updatedSoldItems.splice(index, 1); // Remove item at indexToRemove
      } else {
        console.error('Invalid index provided');
      }
  
      return {
        ...prevInvoiceData,
        puchaseditems: updatedSoldItems, // Update solditems array in invoiceData
      };
    });


    const total = calcSubtotal() - (purchasePrice * quantity);
    setSubTotal(total);
    calcTotal(total, discount);
  };
  
  function generateRandomNumber() {
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
    setgrnNumber('G' + randomNumber.toString());
    setgrnData(prevData =>({
      ...prevData,
      grnNo: 'G' + randomNumber.toString(),
    }))
  }

  const BarcodeGenerator = (grnNumber,selectedproductId)=>{

    const barcode = `${grnNumber}${selectedproductId}`
    return barcode
  }

  function calcSubtotal() {
    setSubTotal(0);
    let total = 0;
    SelectedItems.forEach((selectedItem) => {
      total += selectedItem.quantity * selectedItem.purchasePrice;
    });
    return total
  };

  function calcTotal(total, discount) {
    if(discount<=0) {
      setTotalAmount(total)
      setgrnData(prevData =>({
        ...prevData,
        totalAmount: total,
      }))
    } else if(discount>0 && discount<=100) {
      setTotalAmount(total * ((100 - discount)/100))
      setgrnData(prevData =>({
        ...prevData,
        totalAmount: total * ((100 - discount)/100),
      }))
    } else if(discount>100) {
      setTotalAmount(total * (0))
    }


  }

  const handlesavegrn = async(event)=>{
    event.preventDefault();

    const total = calcSubtotal() + (purchasePrice * quantity);
    setSubTotal(total);
    calcTotal(total, discount);

    console.log(grnData);

    if (
      grnData.grnNo.trim() === '' ||
      String(grnData.totalAmount).trim() === '' ||
      grnData.puchaseditems.length === 0 
    ) {
      showErrorToast('Please fill in all required fields');
      return;
    }

    try{

      const grn = await grnServices.addgrn(grnData);
      
      if(grn.status === 201){
        showSuccessToast("Updated Succesfully")

        setgrnData({
          grnNo: '',
          supplierid:'',
          userid: userid,
          puchaseditems :[],
          totalAmount: ''

        })

        reset();
      }
    }catch(error){
      showErrorToast(" Please Try again ")
    }
  }

  const reset = ()=>{

    setSelectedSupplierId('');
    setSelectedSupplierEmail('');
    setSelectedSupplierMobile('');
    setSelectedItemId('');
    setQuantity('');
    setPurchasePrice('');
    setSelectedItems([])
    setSubTotal('');
    setDiscount('');
    setTotalAmount('');
    setsellingPrice('');
    setSupplierItems([]);
    setSuppliers([])

    setgrnData({
      grnNo: '',
      supplierid:'',
      userid: userid,
      puchaseditems :[],
      totalAmount: ''

    })

    generateRandomNumber();
    setSelectedLabel(null);
    setSelecteditemLabel(null);

    //refetching 
    fetchSuppliers();
   // fetchItems()

  }
  const handlecancel = ()=>{
    reset();
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
                    label: supplier.Fullname,
                  }))}
                  placeholder="Insert supplier detail"
                  value={selectedLabel ? { label: selectedLabel } : null}
                  onChange={(selectedOption) => {
                    setSelectedLabel(selectedOption ? selectedOption.label : null)
                    const selectedSupplierId = selectedOption ? selectedOption.id : null;
                    const selectedSupplierMobile = selectedOption ? selectedOption.contactNo : null;
                    const selectedSupplierEmail = selectedOption ? selectedOption.email : null;
                    setSelectedSupplierId(selectedSupplierId);
                    setSelectedSupplierMobile(selectedSupplierMobile);
                    setSelectedSupplierEmail(selectedSupplierEmail);
                    setgrnData(prevData =>({
                      ...prevData,
                      supplierid: selectedSupplierId,
                    }))
                    
                  }}
                />
              </span>
            </div>
            <div className='content1-container'>
              <span className='content-left'>Supplier Email :</span>
              <span className='content-right'><input type='text' name='Email' value={selectedSupplierEmail} placeholder='xxxxxxxxxx' /></span>
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
                    label: item.Name,
                  }))}
                  value={selecteditemLabel ? { label: selecteditemLabel } : null}
                  placeholder="Insert item detail"
                  onChange={(selectedOption) => {
                    setSelecteditemLabel(selectedOption ? selectedOption.label : null)
                    const selectedIemId = selectedOption ? selectedOption.id : null;
                    setSelectedItemId(selectedIemId);
                    setpurchasedProduct(prevData =>({
                      ...prevData,
                      productId: selectedIemId,
                    }))
                    const itembarcode = BarcodeGenerator(grnNumber,selectedIemId)
                    setpurchasedProduct(prevData =>({
                      ...prevData,
                      barcode: itembarcode,
                    }))
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
              <span className='content-left'>Selling price :</span>
              <span className='content-right'><input type='number' name='grnNo' value={sellingPrice} onChange={handleSellingPriceChange} placeholder='xxxxx.xx' /></span>
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
              <th>Selling Price</th>
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
                  <tr key={selectedItem.index}>
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
                    <td className='price'>{'Rs ' + selectedItem.sell_Price}</td>
                    <td className='quantity'>{selectedItem.quantity}</td>
                    <td className='price'>{'Rs ' + selectedItem.quantity * selectedItem.purchasePrice}</td>
                    <td>
                      <button onClick={() => handleRemoveItem(index, selectedItem.purchasePrice, selectedItem.quantity)}>
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
            <input type='text' name='dscount' value={discount} onChange={handleDiscountChange} />
          </div>
          <div className='value-content'>
            <span>Total Amount: </span>
            <input type='text' name='total-amount' value={totalAmount} disabled />
          </div>
        </div>
      </div>
      <div className='grn-content' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className='button-container' >
          <button style={{ backgroundColor: 'crimson' }} onClick={handlecancel}>Cancel</button>
          <button style={{ backgroundColor: '#2a6592' }}>Save & Print</button>
          <button style={{ backgroundColor: 'green' }} onClick={handlesavegrn}>Save</button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default GRN;
