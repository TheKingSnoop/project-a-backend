import mongoose from "mongoose";
import invoiceSchema from "./invoice.js";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateJoined: {
        type: Date,
        default: Date.now,
    },
    invoices: [invoiceSchema],

});

export default mongoose.model("User", userSchema);