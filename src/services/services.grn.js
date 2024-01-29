import connection from "../connection";

const grnServices = {

  generateGRNID: async (grnId) => {
    try {
      const response = await connection.get(`/grn/generateID/${grnId}`);
      console.log('GRN Data ',response.data)
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllSuppliers: async () => {
    try {
      const response = await connection.get(`/grn/suppliers`);
      console.log('Supplier Data ',response.data)
      return response.data;
    } catch (error) {
      throw new Error('Error fetching suppliers');
    }
  },

  getItems: async (supplierId) => {
    try {
      const response = await connection.get(`/grn/items/${supplierId}`);
      console.log('response data is ',response.data)
      return response.data;

    } catch (error) {
      throw new Error('Error fetching items by ID services');
    }
  },

  addgrn: async(grndata)=>{
    try{
      const response = await connection.post(`/grn/list`, grndata, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.status === 201){
        console.log('response is', response)
        return response;
      }else{
        throw new Error('Error Reciving GRN Data response');
      }
      

    }catch(error){
      throw new Error('Error Passing Invoice Data');
    }
  },

};

export default grnServices;
