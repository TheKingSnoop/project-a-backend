export const GetInvoices = async () => {
  try {
    // below is just an example for now
    const invoices = [
      {
        id: 1,
        amount: 100.0,
        date: "01-01-2025",
      },
      {
        id: 2,
        amount: 200.0,
        date: "01-02-2025",
      },
    ];
    return {
      success: true,
      payload: invoices,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetInvoiceById = async (id) => {
  try {
    const invoice = [
      {
        id: id,
        amount: 100.0,
        date: "01-01-2025",
      },
    ];
    return {
      success: true,
      payload: invoice,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const GenerateInvoice = async (invoiceData) => {
  try {
    // Logic to generate invoice
    console.log("Generating invoice with data:", invoiceData);
    
    return { success: true, message: "Invoice generated successfully", payload: invoiceData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
