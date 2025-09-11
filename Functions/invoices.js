import puppeteer from "puppeteer";
import { InvoiceTemplate } from "../Invoice_Templates/invoice.js";
import s3 from "../s3Client.js";
import dotenv from "dotenv";
import invoiceSchema from "../Schemas/invoice.js";
import Users from "../Schemas/user.js";

dotenv.config();

export const GetInvoices = async () => {
    try {
        // below is just an example for now
        const invoices = [
            {
                id: 1,
                amount: 100.0,
                date: "01-01-2025",
            },
            {
                id: 2,
                amount: 200.0,
                date: "01-02-2025",
            },
        ];
        return {
            success: true,
            payload: invoices,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const GetInvoiceById = async (userId, invoiceId) => {
    try {
        const user = await Users.findOne({ _id: userId })
        const invoice = user.invoices.filter(inv => inv._id.toString() === invoiceId)
        if (invoice.length === 0) {
            return {
                success: false,
                message: "Invoice not found for this user",
            };
        }
        console.log(invoice)

        return {
            success: true,
            payload: invoice,
        };
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return {
                success: false,
                message: "Invalid user ID",
            };
        }
        return { success: false, message: error.message };
    }
};

export const GenerateInvoice = async (invoiceData) => {
    // Generate unique filename for the PDF
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `invoices/invoice-${Date.now()}-${timestamp}.pdf`;

    await AddInvoiceToDB(invoiceData, fileName);
    try {
        // Generate PDF with Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const invoiceHtmlTemplate = InvoiceTemplate(invoiceData);

        await page.setContent(invoiceHtmlTemplate);
        const pdfBuffer = await page.pdf({
            format: "A4",
            footerTemplate: '<div style="font-size:8px; width:100%; text-align:center; margin-bottom:5px;">Page <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
            displayHeaderFooter: true, margin: { top: "40px", bottom: "60px", left: "20px", right: "20px" }
        });

        await browser.close();

        // Upload PDF to S3
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: pdfBuffer,
            ContentType: "application/pdf",
            ContentDisposition: `attachment; filename="invoice-${Date.now()}.pdf"`,
        };

        const uploadResult = await s3.upload(uploadParams).promise();

        return {
            success: true,
            message: "Invoice generated and uploaded successfully",
            payload: {
                s3Location: uploadResult.Location,
                s3Key: uploadResult.Key,
                bucketName: uploadResult.Bucket,
            },
        };
    } catch (error) {
        console.error("Error generating or uploading invoice:", error);
        return { success: false, message: error.message };
    }
};

// Helper function to get a signed URL for downloading an invoice
// export const GetInvoiceDownloadUrl = async (s3Key) => {
//   try {
//     const params = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: s3Key,
//       Expires: 3600, // URL expires in 1 hour
//     };

//     const signedUrl = await s3.getSignedUrlPromise("getObject", params);

//     return {
//       success: true,
//       payload: { downloadUrl: signedUrl },
//     };
//   } catch (error) {
//     console.error("Error generating download URL:", error);
//     return { success: false, message: error.message };
//   }
// };

// Helper function to delete an invoice from S3
// export const DeleteInvoiceFromS3 = async (s3Key) => {
//   try {
//     const params = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: s3Key,
//     };

//     await s3.deleteObject(params).promise();

//     return {
//       success: true,
//       message: "Invoice deleted successfully",
//     };
//   } catch (error) {
//     console.error("Error deleting invoice:", error);
//     return { success: false, message: error.message };
//   }
// };

// const browser = await puppeteer.launch();
//     const page = await browser.newPage();

// await page.setContent(html);
//     const pdfBuffer = await page.pdf({ format: 'A4' });

//     await browser.close();
//     return pdfBuffer;

export const AddInvoiceToDB = async (invoiceData, fileName) => {
    try {
        const {
            id,
            vatPercentage,
            invoiceItemsTotal,
            vat,
            finalTotal,
            invoiceItems,
            titleOfInvoice,
            nameOfYourCompany,
            yourName,
            yourSurname,
            yourAddress,
            yourCity,
            yourPostCode,
            yourEmail,
            phoneNumber,
            companyName,
            clientName,
            clientSurname,
            clientAddress,
            clientCity,
            clientPostCode,
            clientEmail,
            referenceNumber,
            issueDate,
            dueDate,
            nameOnAccount,
            sortCode,
            accountNumber,
            bankName
        } = invoiceData;
        const user = await Users.findOne({ _id: id });
        const invoice = {
            vatPercentage,
            invoiceItemsTotal,
            vat,
            finalTotal,
            invoiceItems,
            titleOfInvoice,
            nameOfYourCompany,
            yourName,
            yourSurname,
            yourAddress,
            yourCity,
            yourPostCode,
            yourEmail,
            phoneNumber,
            companyName,
            clientName,
            clientSurname,
            clientAddress,
            clientCity,
            clientPostCode,
            clientEmail,
            referenceNumber,
            issueDate,
            dueDate,
            nameOnAccount,
            sortCode,
            accountNumber,
            bankName,
            awsKey: fileName
        }
        user.invoices.push(invoice);
        await user.save();
        return {
            success: true,
            message: "Invoice added successfully",
            invoice: user
        }
    }
    catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}
