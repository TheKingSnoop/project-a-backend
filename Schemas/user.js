import mongoose from "mongoose";
import invoiceSchema from "./invoice.js";
import clientSchema from "./client.js";


const userSchema = mongoose.Schema({
  title: {
    type: String,
  },
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
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  postCode: {
    type: String,
  },
  telephone: {
    type: String,
  },
  companyName: {
    type: String,
  },
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  sortCode: {
    type: String,
  },
  accountName: {
    type: String,
  },
  invoices: [invoiceSchema],
  clients: [clientSchema],
});

export default mongoose.model("User", userSchema);
