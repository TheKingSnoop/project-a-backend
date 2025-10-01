import express from "express";
import { GenerateInvoice, GetInvoiceById, GetInvoiceDownloadUrl, GetInvoicesByUserId, DeleteInvoiceById, UpdateInvoiceById } from "../Functions/invoices.js";
import checkAuth from "../middleware/check_auth.js";
const router = express.Router();

router.post("/generate", checkAuth, async (req, res) => {
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

// Route to get download URL for an invoice
router.get("/download-invoice/:userId/:invoiceId", checkAuth, async (req, res) => {
  const { userId, invoiceId } = req.params;
  try {
    const result = await GetInvoiceDownloadUrl(userId, invoiceId);
    if (result.success) {
      res.status(200).send(result);
    } else {
      res.status(404).send(result);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-invoice/:userId/:invoiceId", checkAuth, async (req, res) => {
  const { userId, invoiceId } = req.params;
  try {
    const invoice = await GetInvoiceById(userId, invoiceId);
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

router.get("/get-all-invoices/:userId", checkAuth, async (req, res) => {
  const { userId } = req.params;
  try {
    const invoices = await GetInvoicesByUserId(userId);
    if (invoices.success) {
      res.status(200).send(invoices);
    } else {
      res.status(404).send(invoices);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.put("/update/:userId/:invoiceId", checkAuth, async (req, res) => {
  const { userId, invoiceId } = req.params;
  const updatedData = req.body;

  try {
    const result = await UpdateInvoiceById(userId, invoiceId, updatedData);
    if (result.success) {
      res.status(200).send(result);
    } else {
      res.status(404).send(result);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/delete/:userId/:invoiceId", checkAuth, async (req, res) => {
  const { userId, invoiceId } = req.params;
  try {
    const result = await DeleteInvoiceById(userId, invoiceId);
    if (result.success) {
      res.status(200).send(result);
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
