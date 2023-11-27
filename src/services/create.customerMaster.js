const apiUrl = 'http://localhost:3000/customerMaster';

const customerMasterCreate = {
  createCustomer: async (customerData) => {
    const response = await fetch(`${apiUrl}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error('Error creating customer');
    }

    return response.json();
  },
};

export default customerMasterCreate;
