import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    referenceNumber: {
        type: Number,
        required: true,
    },
});
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