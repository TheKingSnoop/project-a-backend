import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  company_name: {
    type: String,
  },
  first_name: {
    type: String,
  },
  surname: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  post_code: {
    type: String,
  },
  email: {
    type: String,
  },
});

export default clientSchema;
