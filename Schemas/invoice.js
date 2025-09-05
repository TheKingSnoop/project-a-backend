import mongoose from "mongoose";

const invoiceSchema = mongoose.model("Invoice" , mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    referenceNumber: {
        type: Number,
        required: true,
    },
}));

export default invoiceSchema;