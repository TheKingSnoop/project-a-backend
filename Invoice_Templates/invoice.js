export function InvoiceTemplate(invoiceData) {
    const html = `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #333; }
                    thead tr { background-color: #f2f2f2; }
                    .title { text-align: center; }
                    .billing-info { display: flex; justify-content: space-between; }
                    .invoice-box, .invoice-total { text-align: right; }
                    .blue-text { color: #005ac2; }
                </style>
            </head>
            <body>
                <h1 class="title blue-text">INVOICE</h1>
                <div class="your-company">
                    <p class="blue-text"><strong>${invoiceData.nameOfYourCompany ? invoiceData.nameOfYourCompany : ""}</strong></p>
                    <p>${invoiceData.yourName} ${invoiceData.yourSurname}</p>
                    <p>${invoiceData.yourAddress}</p>
                    <p>${invoiceData.yourCity}, ${invoiceData.yourPostCode}</p>
                    <p>${invoiceData.phoneNumber ? invoiceData.phoneNumber : ""}</p>
                    <p>${invoiceData.yourEmail ? invoiceData.yourEmail : ""}</p>
                </div>
                <div class="billing-info">
                    <div class="bill-to">
                        <h3 class="blue-text">Bill To:</h3>
                        <p>${invoiceData.companyName ? invoiceData.companyName : ""}</p>
                        <p>${invoiceData.clientName} ${invoiceData.clientSurname}</p>
                        <p>${invoiceData.clientAddress}</p>
                        <p>${invoiceData.clientCity}, ${invoiceData.clientPostCode}</p>
                        <p>${invoiceData.clientEmail ? invoiceData.clientEmail : ""}</p>
                    </div>
                    <div class="invoice-box">
                        <h3 class="blue-text">Invoice Number: ${invoiceData.referenceNumber}</h3>
                        <p>Invoice Date: ${invoiceData.issueDate}</p>
                        <p>Due Date: ${invoiceData.dueDate ? invoiceData.dueDate : ""}</p>
                    </div>
                </div>
                <table border="1" cellpadding="10" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>DESCRIPTION</th>
                            <th>QTY</th>
                            <th>UNIT COST</th>
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceData.invoiceItems.map(item => `<tr>
                                <td style='width:70%'>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>£${item.price}</td>
                                <td>£${item.amount}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
                <div class="invoice-total">
                    <h3 class="blue-text">Invoice Total:</h3>
                    <p>Subtotal: £${invoiceData.invoiceItemsTotal}</p>
                    ${invoiceData.vatPercentage ? `<p>VAT (${invoiceData.vatPercentage}%): £${invoiceData.vat}</p>` : ""}
                    <h4 style="border-top: 1px solid #005ac2; display: inline; border-bottom: 1px solid #005ac2; background-color: #d8e2ff;"><strong>Total: £${invoiceData.finalTotal}</strong></h4>
                </div>
                <div class="bank-details">
                    <h3 class="blue-text">Bank Details:</h3>
                    <p>Name on Account: ${invoiceData.nameOnAccount}</p>
                    <p>Sort Code: ${invoiceData.sortCode}</p>
                    <p>Account Number: ${invoiceData.accountNumber}</p>
                    ${invoiceData.bankName ? `<p>Bank Name: ${invoiceData.bankName}</p>` : ""}
                </div>
            </body>
        </html>
        `;
    return html;
}


