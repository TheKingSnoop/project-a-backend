import express from "express";
import { GenerateInvoice, GetInvoiceById, GetInvoices } from "../Functions/invoices.js";

const router = express.Router();

router.get("/all-invoices", async (req, res) => {
  try {
    const invoices = await GetInvoices();
    if (invoices.success) {
      res.status(200).send(invoices);
    } else {
      res.status(500).send(invoices);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error.message",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await GetInvoiceById(id);
    if (invoice.success) {
      res.status(200).send(invoice);
    } else {
      res.status(404).send(invoice);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/generate", async (req, res) => {
  const invoiceData = req.body;
  try {
    const result = await GenerateInvoice(invoiceData);
    if (result.success) {
      res.status(201).send(result);
    } else {
      res.status(500).send(result);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
