import puppeteer from "puppeteer";
import { InvoiceTemplate } from "../Invoice_Templates/invoice.js";

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

export const GetInvoiceById = async (id) => {
    try {
        const invoice = [
            {
                id: id,
                amount: 100.0,
                date: "01-01-2025",
            },
        ];
        return {
            success: true,
            payload: invoice,
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const GenerateInvoice = async (invoiceData) => {


    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const invoiceHtmlTemplate = InvoiceTemplate(invoiceData)

        await page.setContent(invoiceHtmlTemplate);
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();
        return pdfBuffer;

        // return { success: true, message: "Invoice generated successfully", payload: invoiceData };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


// const browser = await puppeteer.launch();
//     const page = await browser.newPage();


// await page.setContent(html);
//     const pdfBuffer = await page.pdf({ format: 'A4' });

//     await browser.close();
//     return pdfBuffer;