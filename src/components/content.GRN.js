import React, { useEffect, useState, useRef } from 'react';
import Select from "react-select";
import grnServices from '../services/services.grn';
import DeleteLogo from './../assets/icons/delete.png';

import { useUser } from '../services/services.UserContext';
import { showErrorToast, showSuccessToast } from "../services/services.toasterMessage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import QRCode from 'qrcode-generator';
import CompanyLogo from './../assets/logos/Uni_Mart.png';



function GRN() {

  const [grnNumber, setgrnNumber] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedSupplierMobile, setSelectedSupplierMobile] = useState('');
  const [selectedSupplierName, setSelectedSupplierName] = useState('');
  const itemNameInputRef = useRef(null); 
  const [selectedSupplierEmail, setSelectedSupplierEmail] = useState('');
  const [items, setSupplierItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [SelectedItems, setSelectedItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const itemQuantityInputRef = useRef(null); 
  const [sellingPrice, setsellingPrice] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selecteditemLabel, setSelecteditemLabel] = useState(null);
  const {userid , fullname} = useUser();

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

    const SelectedItem = items.find((item) => item.ID === parseInt(selectedItemId, 10));

    if (!quantity || isNaN(quantity)) {
      console.error('Quantity is empty or not a valid number');
      itemNameInputRef.current.focus();
      return;
     }  

    const newItem = {
      itemId: selectedItemId,
      itemName :SelectedItem.Name,
      itemCode : SelectedItem.Code,
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
    itemNameInputRef.current.focus();

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
        updatedSoldItems.splice(index, 1); 
      } else {
        console.error('Invalid index provided');
      }
  
      return {
        ...prevInvoiceData,
        puchaseditems: updatedSoldItems, 
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

    fetchSuppliers();

  }
  const handlecancel = ()=>{
    reset();
  }

  const handleExportToPDF = () =>{

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();

      const qrCodeData = `${grnNumber}\nDate: ${formattedDate}\nTime: ${formattedTime}\nSupplier: ${selectedSupplierName}\nSupplier Contact: ${selectedSupplierMobile}\nSupplier Email: ${selectedSupplierEmail}`;
      const qr = QRCode(0, 'L');
      qr.addData(qrCodeData);
      qr.make();

      const qrCodeImage = qr.createDataURL();  
      const unit = "pt";
      const size = "A4";
      const orientation = "landscape";
      const pdf = new jsPDF(unit , unit , size ,orientation);

      function headerText(){
        pdf.setFont('helvetica', 'bold'); 
        pdf.setFontSize(20); 
        pdf.setTextColor(40);
        }
        function pdftext1(){
          pdf.setFont('helvetica', 'regular'); 
          pdf.setFontSize(12); 
          pdf.setTextColor(40);
        }
        function pdftext2(){
          pdf.setFont('times', 'regular');
          pdf.setFontSize(12); 
          pdf.setTextColor(40);
        } 

        function footerText(){
          pdf.setFont('crimson text', 'regular');
          pdf.setFontSize(10); 
          pdf.setTextColor(40);
        } 

      const headerLeft = function(data) {
        pdf.setFontSize(8);
        pdf.setTextColor(40);
        pdf.addImage(CompanyLogo, 'PNG' , 40,20,70,70);
        headerText();
        pdf.text('UNI MART' , 115 , 35);
        pdftext2();
        pdf.text('University Of Ruhuna' , 115 , 50);
        pdf.text('Wellamadama' , 115 , 63);
        pdf.text('Matara' , 115 , 76);
        pdf.text('0372222222' , 115 , 89);

      }

      const SupplierDetails = function(data ){  
        pdf.text(`Supplier Name:`, 45, 150);
        pdf.text(`${selectedSupplierName}`, 140, 150);
        pdf.text(`Supplier Mobile:`, 45, 165);
        pdf.text(`${selectedSupplierMobile}`, 140, 165);
        pdf.text(`Supplier Email:`, 45, 180);
        pdf.text(`${selectedSupplierEmail}`, 140, 180);
        pdf.text(`User:`, 400, 150);
        pdf.text(`${fullname}`, 430, 150);
    
      }

      const headerRight = function(data) {
        headerText();
        pdf.text('GRN' , 400 , 35);
        pdf.addImage(qrCodeImage, 'JPEG', 396, 37, 60, 60);
        pdftext2();
        pdf.text(`${grnNumber}`, 460, 55);
        pdf.text(`${formattedDate}`, 460, 70);
        pdf.text(`${formattedTime}`, 460, 85);
    };

      const addTransactionTabel = (pdf , subTotal , discount , totalAmount) =>{
        const subTotalData = [["Subtotal", `Rs${subTotal}`]]
        const discountData = [["Discount", `${discount}%`]] 
        const totalAmountData = [["Total Amount", `Rs${totalAmount}`]]  
        const startYPosition = 250 +itemTableHeight;
        const marginAdjustment = 10;      
        pdf.autoTable({
        body:  [...subTotalData, ...discountData, ...totalAmountData],
        theme:'striped',
        styles: {
                
                body: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
              },
  
        margin: { top: startYPosition + marginAdjustment , left: 330 },
        tableWidth: 230,
        columnStyles: {
                1: { columnWidth: 80 }, 
              },
                      
      })
      pdftext1();
      pdf.text('Thank You!', 270, pdf.autoTable.previous.finalY + marginAdjustment + 100);     
    }
      const headers = ["No" ,"Item" ,"Item Code",  "Purchase Price" , "Quantity" , "Total Price"];
      const data = SelectedItems.map((item , index) =>[index+1 ,item.itemName,item.itemCode, `Rs${item.purchasePrice}`, item.quantity , `Rs${item.purchasePrice * item.quantity}` ])
      const itemTableHeight = SelectedItems.length * 20;

        
      pdf.autoTable({
        head: [headers],
        body: data,
        theme: 'striped',
        styles: {
          head: { fillColor: [38, 2, 97], textColor: [255, 255, 255] }, 
          body: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, 
        },
        columnStyles: {
          0: { columnWidth: 40 }, 
          1: { columnWidth: 170 }, 
          2: { columnWidth: 80 }, 
          3: { columnWidth: 80 }, 
          4: { columnWidth: 70 },
          5: { columnWidth: 80 },  
          
        },
        margin: { top: 220 },
        addPageContent: function(data) {
          pdf.setFontSize(8);
          pdf.setTextColor(40);
          headerLeft(data);
          headerRight(data);
          pdf.line(20, 120, 580, 120);
          SupplierDetails(data);
          pdf.line(20, 205, 580, 205);
          addTransactionTabel(pdf , subTotal , discount, totalAmount );
          pdf.line(20, 800, 580, 800);
          footerText();
          pdf.text("©INNOVA ERP Solutions. All rights reserved.",210,815);
          pdf.text("Wellamadama, Matara , 0412223334",230,830)
        }
      });  
      pdf.save("ERP-GRN.pdf");

  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
  
      const activeElement = document.activeElement;
      const inputFieldIds = ['itemInput','quantityInput', 'purchaseInput', 'sellingInput'];
  
      const currentIndex = inputFieldIds.indexOf(activeElement.id);
  
      if (currentIndex !== -1) {
        if (currentIndex < inputFieldIds.length - 1) {
          const nextInputFieldId = inputFieldIds[currentIndex + 1];
  
          if (nextInputFieldId === 'quantityInput') {
            const isLastItemNameInput = activeElement.id === 'itemNameInput' && currentIndex === inputFieldIds.length - 2;
  
            if (isLastItemNameInput) {
              document.getElementById('quantityInput').focus();
            } else {
              document.getElementById(nextInputFieldId).focus();
            }
          } else {
            document.getElementById(nextInputFieldId).focus();
          }
        } else {
          document.getElementById('GRNFormId').submit();
        }
      }
    }
  };
   
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
                    Fullname : `${supplier.Fullname}`,
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

                    const selectedSupplierName  = selectedOption ? selectedOption.Fullname : null;
                    setSelectedSupplierName(selectedSupplierName);
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
      <form  className='grn-content'>
          <span className='content1-left'>
            <div className='content1-container'>
              <span className='content-left'>Item Name :</span>
              <span className='content-right'>
                <Select 
                id='itemInput'
                className='select-box'
                ref={itemNameInputRef}
                 
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
                  onKeyPress={handleKeyPress} 
                />               
              </span>
            </div>
            <div className='content1-container'>
              <span className='content-left'>Quantity :</span>
              <span className='content-right'><input type='number' id='quantityInput' name='quantity' value={quantity} onChange={handleQunatityChange} placeholder='xxxx' onKeyDown={handleKeyPress}  /></span>
            </div>
          </span>
          <span className='content1-right'> 
            <div className='content1-container'>
              <span className='content-left'>Purchase price :</span>
              <span className='content-right'><input type='number' id='purchaseInput' name='grnNo' value={purchasePrice} onChange={handlePurchasePriceChange} placeholder='xxxxx.xx' onKeyDown={handleKeyPress} /></span>
            </div>
            <div className='content1-container'>
              <span className='content-left'>Selling price :</span>
              <span className='content-right'><input type='number' id='sellingInput' name='grnNo' value={sellingPrice} onChange={handleSellingPriceChange} placeholder='xxxxx.xx' /></span>
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
          <button style={{ backgroundColor: '#2a6592' }} onClick={handleExportToPDF}>Save & Print</button>
          <button style={{ backgroundColor: 'green' }} onClick={handlesavegrn}>Save</button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}
export default GRN;
