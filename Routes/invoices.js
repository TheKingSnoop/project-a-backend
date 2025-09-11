import express from "express";
import { AddInvoiceToDB, GenerateInvoice, GetInvoiceById, GetInvoices } from "../Functions/invoices.js";
import invoiceSchema from "../Schemas/invoice.js";
// GetInvoiceDownloadUrl, DeleteInvoiceFromS3

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


// template for future features
// Route to get download URL for an invoice
// router.get("/download/:s3Key", async (req, res) => {
//   const { s3Key } = req.params;
//   try {
//     const result = await GetInvoiceDownloadUrl(decodeURIComponent(s3Key));
//     if (result.success) {
//       res.status(200).send(result);
//     } else {
//       res.status(404).send(result);
//     }
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // Route to delete an invoice from S3
// router.delete("/delete/:s3Key", async (req, res) => {
//   const { s3Key } = req.params;
//   try {
//     const result = await DeleteInvoiceFromS3(decodeURIComponent(s3Key));
//     if (result.success) {
//       res.status(200).send(result);
//     } else {
//       res.status(500).send(result);
//     }
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

//Mongodb invoice TEST

router.post("/add-invoice", async (req, res) => {
    const newInvoiceData = req.body;
    try {
        const result = await AddInvoiceToDB(newInvoiceData);
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
