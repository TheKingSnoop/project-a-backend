import puppeteer from "puppeteer";
import { InvoiceTemplate } from "../Invoice_Templates/invoice.js";
import s3 from "../s3Client.js";
import dotenv from "dotenv";
import Users from "../Schemas/user.js";
import { chromium } from "playwright";

dotenv.config();

export const GetInvoicesByUserId = async (userId) => {
  try {
    const user = await Users.findOne({ _id: userId });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      payload: user.invoices,
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
    const user = await Users.findOne({ _id: userId });
    const invoice = user.invoices.filter((inv) => inv._id.toString() === invoiceId);
    if (invoice.length === 0) {
      return {
        success: false,
        message: "Invoice not found for this user",
      };
    }

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
  try {
    // Generate unique filename for the PDF
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `invoices/invoice-${Date.now()}-${timestamp}.pdf`;

    const addInvoiceToDBResult = await AddInvoiceToDB(invoiceData, fileName);
    // Generate PDF using helper function
    const pdfResult = await generatePDFBuffer(invoiceData);
    if (!pdfResult.success) {
      return { success: false, message: pdfResult.message };
    }

    // Upload PDF to S3 using helper function
    const uploadResult = await uploadPDFToS3(pdfResult.pdfBuffer, fileName);
    if (!uploadResult.success) {
      return { success: false, message: uploadResult.message };
    }

    return {
      success: true,
      message: "Invoice generated and uploaded successfully",
      payload: {
        s3Location: uploadResult.s3Location,
        s3Key: uploadResult.s3Key,
        bucketName: uploadResult.bucketName,
        dbInvoiceId: addInvoiceToDBResult.invoice.invoices.slice(-1)[0]._id,
      },
    };
  } catch (error) {
    console.error("Error generating or uploading invoice:", error);
    return { success: false, message: error.message };
  }
};

// Helper function to get a signed URL for downloading an invoice
export const GetInvoiceDownloadUrl = async (userId, invoiceId) => {
  try {
    const invoiceData = await GetInvoiceById(userId, invoiceId);
    const s3Key = invoiceData.payload[0].awsKey;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Expires: 3600, // URL expires in 1 hour
    };

    const signedUrl = await s3.getSignedUrlPromise("getObject", params);

    return {
      success: true,
      payload: { downloadUrl: signedUrl },
    };
  } catch (error) {
    console.error("Error generating download URL:", error);
    return { success: false, message: error.message };
  }
};

// Helper function to generate PDF buffer from invoice data

const generatePDFBuffer = async (invoiceData) => {
  let browser = null;
  try {
    console.log("Launching Playwright browser...");
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    console.log("Creating new page...");
    const page = await browser.newPage();

    console.log("Setting content...");
    const invoiceHtmlTemplate = InvoiceTemplate(invoiceData);
    await page.setContent(invoiceHtmlTemplate);

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "40px", bottom: "60px", left: "20px", right: "20px" },
    });

    console.log("PDF generated successfully");
    return { success: true, pdfBuffer };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return { success: false, message: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Helper function to upload PDF to S3
const uploadPDFToS3 = async (pdfBuffer, fileName) => {
  try {
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
      s3Location: uploadResult.Location,
      s3Key: uploadResult.Key,
      bucketName: uploadResult.Bucket,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return { success: false, message: error.message };
  }
};

// Helper function to delete an invoice from S3
export const DeleteInvoiceFromS3 = async (s3Key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    };

    await s3.deleteObject(params).promise();

    return {
      success: true,
      message: "Invoice deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, message: error.message };
  }
};

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
      bankName,
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
      awsKey: fileName,
    };
    user.invoices.push(invoice);
    await user.save();
    return {
      success: true,
      message: "Invoice added successfully",
      invoice: user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const DeleteInvoiceById = async (userId, invoiceId) => {
  try {
    const user = await Users.findOne({ _id: userId });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Find the invoice to get the S3 key before deleting
    const invoiceToDelete = user.invoices.find((inv) => inv._id.toString() === invoiceId);
    if (!invoiceToDelete) {
      return {
        success: false,
        message: "Invoice not found",
      };
    }

    const s3Key = invoiceToDelete.awsKey;

    // Remove invoice from MongoDB
    user.invoices = user.invoices.filter((inv) => inv._id.toString() !== invoiceId);
    const deleteInvoice = await user.save();

    if (!deleteInvoice) {
      return {
        success: false,
        message: "Failed to delete invoice from database",
      };
    }

    // Delete PDF from S3 if s3Key exists
    if (s3Key) {
      const s3DeleteResult = await DeleteInvoiceFromS3(s3Key);
      if (!s3DeleteResult.success) {
        console.warn(`Warning: Invoice removed from database but failed to delete PDF from S3: ${s3DeleteResult.message}`);
        // Don't fail the entire operation if S3 deletion fails
        return {
          success: true,
          message: "Invoice deleted from database successfully, but PDF removal from S3 failed",
          warning: s3DeleteResult.message,
        };
      }
    }

    return {
      success: true,
      message: "Invoice deleted successfully from both database and S3",
      deletedS3Key: s3Key,
    };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const UpdateInvoiceById = async (userId, invoiceId, updatedData) => {
  let newS3Key = null; // Track new S3 key for rollback

  try {
    const user = await Users.findOne({ _id: userId });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const invoiceIndex = user.invoices.findIndex((inv) => inv._id.toString() === invoiceId);
    if (invoiceIndex === -1) {
      return {
        success: false,
        message: "Invoice not found",
      };
    }

    // Get the current invoice and backup original data
    const currentInvoice = user.invoices[invoiceIndex];
    const oldAwsKey = currentInvoice.awsKey;
    const originalInvoiceData = { ...(currentInvoice._doc || currentInvoice) };

    // Update the invoice with the new data (but keep the old awsKey for now)
    const updatedInvoice = {
      ...originalInvoiceData,
      ...updatedData,
    };

    // Generate new PDF with updated data
    const pdfResult = await generatePDFBuffer(updatedInvoice);
    if (!pdfResult.success) {
      return { success: false, message: `PDF generation failed: ${pdfResult.message}` };
    }

    // Create new filename for the updated PDF
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const newFileName = `invoices/invoice-${Date.now()}-${timestamp}.pdf`;

    // Upload new PDF to S3
    const uploadResult = await uploadPDFToS3(pdfResult.pdfBuffer, newFileName);
    if (!uploadResult.success) {
      return { success: false, message: `S3 upload failed: ${uploadResult.message}` };
    }

    newS3Key = uploadResult.s3Key; // Store for potential rollback

    // Update the invoice in MongoDB with new data and new awsKey
    user.invoices[invoiceIndex] = {
      ...updatedInvoice,
      awsKey: uploadResult.s3Key,
    };

    // Save the updated user document
    const saveResult = await user.save();
    if (!saveResult) {
      throw new Error("Failed to save updated invoice to database");
    }

    // Delete the old PDF from S3 (after successful update)
    if (oldAwsKey && oldAwsKey !== uploadResult.s3Key) {
      const deleteResult = await DeleteInvoiceFromS3(oldAwsKey);
      if (!deleteResult.success) {
        console.warn(`Warning: Failed to delete old PDF from S3: ${deleteResult.message}`);
        // Don't fail the entire operation if old file deletion fails
      }
    }

    return {
      success: true,
      message: "Invoice updated successfully with new PDF generated",
      invoice: user.invoices[invoiceIndex],
      s3Info: {
        newS3Key: uploadResult.s3Key,
        s3Location: uploadResult.s3Location,
        oldS3Key: oldAwsKey,
      },
    };
  } catch (error) {
    console.error("Error updating invoice:", error);

    // Rollback: If we uploaded a new file but failed to update DB, clean up the new file
    if (newS3Key) {
      try {
        await DeleteInvoiceFromS3(newS3Key);
        console.log(`Rollback: Successfully deleted orphaned S3 file: ${newS3Key}`);
      } catch (rollbackError) {
        console.error(`Rollback failed: Could not delete S3 file ${newS3Key}:`, rollbackError);
      }
    }

    return {
      success: false,
      message: `Update failed: ${error.message}`,
    };
  }
};
