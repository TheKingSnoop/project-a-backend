export function InvoiceTemplate(invoiceData) {
    const html = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                .invoice-box { border: 1px solid #ddd; padding: 20px; }
                </style>
        </head>
        <body>
            <div class="invoice-box">
                <h1>Invoice</h1>
                <p>Customer: ${invoiceData.clientName}</p>
                <p>Amount: $${invoiceData.invoiceItems[0].amount}</p>
                <p>Due Date: $${invoiceData.dueDate}</p>
            </div>
        </body>
        </html>
        `;
    return html;
}


