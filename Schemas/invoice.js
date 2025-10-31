import mongoose, { trusted } from "mongoose";

const invoiceSchema = new mongoose.Schema({
    awsKey: {
        type: String
    },
    vatPercentage: {
        type: Number,
    },
    invoiceItemsTotal: {
        type: Number
    },
    vat: {
        type: Number
    },
    finalTotal: {
        type: Number
    },
    invoiceItems: [
        {
            id: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }],
    titleOfInvoice: {
        type: String,
        required: true,
    },
    nameOfYourCompany: {
        type: String
    },
    yourName: {
        type: String
    },
    yourSurname: {
        type: String
    },
    yourAddress: {
        type: String
    },
    yourCity: {
        type: String
    },
    yourPostCode: {
        type: String
    },
    yourEmail: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    companyName: {
        type: String
    },
    clientName: {
        type: String
    },
    clientSurname: {
        type: String
    },
    clientAddress: {
        type: String
    },
    clientCity: {
        type: String
    },
    clientPostCode: {
        type: String
    },
    clientEmail: {
        type: String
    },
    referenceNumber: {
        type: Number,
        required: true,
    },
    issueDate: {
        type: String,
        required: true
    },
    nameOnAccount: {
        type: String
    },
    sortCode: {
        type: String
    },
    accountNumber: {
        type: String
    },
    bankName: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

export default invoiceSchema;