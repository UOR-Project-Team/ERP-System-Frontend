import connection from "../connection";

const reportsServices ={

    getProfitLoss: async (startDate,endDate) => {
        try {
            console.log("Date in services", startDate, endDate)
            const response = await connection.get('/report/profitloss',{
            
                params: {
                    startDate: startDate,
                    endDate: endDate
                  }
            });

          console.log("response is", response)
          return response.data;
        } catch (error) {
          throw new Error('Error Retrieving Profit & Loss Information');
        }
      },
    
      getStockMovement : async () => {
        try{
          const response = await connection.get('/report/stock')
          console.log(response)
          return response.data;

        }catch (error) {
          throw new Error ('Error retrieving Stock movement Data');
        }
      }

  }
  
  export default reportsServices;