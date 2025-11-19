import { consolePrint } from "./consolePrintFunction";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import PDFDocument from "pdfkit";





export interface InvoiceDataInterface {
    transactionId: string;
    bookingDate: Date;
    customerName: string;
    tourTitle: string;
    guestsCount: number;
    totalAmount: number;
}





export const generatePdfInvoice = async (invoiceData: InvoiceDataInterface) => {
    try {
        return new Promise<Buffer>((resolve, reject) => {

            // ---------- PDF Document Setup ----------
            const document = new PDFDocument({
                size: "A4",
                margin: 50
            });

            // ---------- Stream PDF to Buffer -----------
            const buffer: Uint8Array[] = [];
            document.on("data", (chunk) => buffer.push(chunk));
            document.on("end", () => resolve(Buffer.concat(buffer)));
            document.on("error", (error) => reject(error));

            // ---------- Helpers ----------
            const formatDate = (date: Date) =>
                new Date(date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                });

            const formatCurrency = (value: number) =>
                `${value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })} BDT`;

            const primaryColor = "#0F766E"; // teal
            const textDark = "#111827";
            const textMuted = "#6B7280";
            const borderColor = "#E5E7EB";
            const softBg = "#F3F4F6";

            const pageWidth = document.page.width;
            const contentWidth = pageWidth - 100; // margin * 2

            // ---------- HEADER ----------
            const headerHeight = 90;

            document
                .rect(50, 40, contentWidth, headerHeight)
                .fill(primaryColor);

            // Brand
            document
                .fillColor("#FFFFFF")
                .font("Helvetica-Bold")
                .fontSize(22)
                .text("PH Tour Management", 60, 52, {
                    width: contentWidth / 2,
                    align: "left"
                });

            document
                .fontSize(12)
                .font("Helvetica")
                .text("Invoice", 60, 84);

            // Invoice meta (right side)
            document
                .font("Helvetica")
                .fontSize(10)
                .text(
                    `Transaction ID: ${invoiceData.transactionId}`,
                    60 + contentWidth / 2,
                    52,
                    {
                        width: contentWidth / 2 - 10,
                        align: "right"
                    }
                )
                .text(
                    `Booking Date: ${formatDate(invoiceData.bookingDate)}`,
                    60 + contentWidth / 2,
                    68,
                    {
                        width: contentWidth / 2 - 10,
                        align: "right"
                    }
                );

            document.fillColor(textDark);

            // ---------- COMPANY & CUSTOMER INFO ----------
            let cursorY = 40 + headerHeight + 30;

            // From (company)
            document
                .font("Helvetica-Bold")
                .fontSize(11)
                .fillColor(textDark)
                .text("From", 50, cursorY);

            document
                .font("Helvetica")
                .fontSize(10)
                .fillColor(textMuted)
                .text("PH Tour Management", 50, cursorY + 16)
                .text("Dhaka, Bangladesh", 50, cursorY + 30)
                .text("Email: support@phtour.com", 50, cursorY + 44);

            // Bill To (customer)
            document
                .font("Helvetica-Bold")
                .fontSize(11)
                .fillColor(textDark)
                .text("Bill To", 50 + contentWidth / 2, cursorY, {
                    width: contentWidth / 2,
                    align: "left"
                });

            document
                .font("Helvetica")
                .fontSize(10)
                .fillColor(textMuted)
                .text(
                    invoiceData.customerName,
                    50 + contentWidth / 2,
                    cursorY + 16,
                    {
                        width: contentWidth / 2,
                        align: "left"
                    }
                )
                .text(
                    `Tour: ${invoiceData.tourTitle}`,
                    50 + contentWidth / 2,
                    cursorY + 30,
                    {
                        width: contentWidth / 2,
                        align: "left"
                    }
                );

            cursorY += 80;

            // ---------- TOUR SUMMARY BOX ----------
            document
                .lineWidth(0.5)
                .strokeColor(borderColor)
                .roundedRect(50, cursorY, contentWidth, 70, 6)
                .stroke();

            const boxLeftX = 60;
            const boxColWidth = contentWidth / 3;

            // Tour
            document
                .font("Helvetica-Bold")
                .fontSize(10)
                .fillColor(textMuted)
                .text("Tour", boxLeftX, cursorY + 12);

            document
                .font("Helvetica")
                .fontSize(11)
                .fillColor(textDark)
                .text(invoiceData.tourTitle, boxLeftX, cursorY + 28, {
                    width: boxColWidth - 10
                });

            // Guests
            document
                .font("Helvetica-Bold")
                .fontSize(10)
                .fillColor(textMuted)
                .text("Guests", boxLeftX + boxColWidth, cursorY + 12);

            document
                .font("Helvetica")
                .fontSize(11)
                .fillColor(textDark)
                .text(
                    `${invoiceData.guestsCount} guest(s)`,
                    boxLeftX + boxColWidth,
                    cursorY + 28,
                    {
                        width: boxColWidth - 10
                    }
                );

            // Booking date
            document
                .font("Helvetica-Bold")
                .fontSize(10)
                .fillColor(textMuted)
                .text(
                    "Booking Date",
                    boxLeftX + boxColWidth * 2,
                    cursorY + 12
                );

            document
                .font("Helvetica")
                .fontSize(11)
                .fillColor(textDark)
                .text(
                    formatDate(invoiceData.bookingDate),
                    boxLeftX + boxColWidth * 2,
                    cursorY + 28,
                    {
                        width: boxColWidth - 10
                    }
                );

            cursorY += 90;

            // ---------- AMOUNT TABLE ----------
            const tableLeft = 50;
            const tableTop = cursorY;
            const tableRowHeight = 24;

            // Header row
            document
                .rect(tableLeft, tableTop, contentWidth, tableRowHeight)
                .fill(softBg);

            document
                .fillColor(textDark)
                .font("Helvetica-Bold")
                .fontSize(10)
                .text("Description", tableLeft + 10, tableTop + 7)
                .text("Guests", tableLeft + contentWidth * 0.55, tableTop + 7, {
                    width: 60,
                    align: "right"
                })
                .text("Amount", tableLeft + contentWidth * 0.75, tableTop + 7, {
                    width: 80,
                    align: "right"
                });

            // Single item row
            const itemTop = tableTop + tableRowHeight;

            document
                .rect(tableLeft, itemTop, contentWidth, tableRowHeight)
                .fill("#FFFFFF");

            document
                .fillColor(textDark)
                .font("Helvetica")
                .fontSize(10)
                .text(
                    `Tour Package – ${invoiceData.tourTitle}`,
                    tableLeft + 10,
                    itemTop + 7,
                    {
                        width: contentWidth * 0.5 - 20
                    }
                )
                .text(
                    `${invoiceData.guestsCount}`,
                    tableLeft + contentWidth * 0.55,
                    itemTop + 7,
                    {
                        width: 60,
                        align: "right"
                    }
                )
                .text(
                    formatCurrency(invoiceData.totalAmount),
                    tableLeft + contentWidth * 0.75,
                    itemTop + 7,
                    {
                        width: 80,
                        align: "right"
                    }
                );

            const afterRowY = itemTop + tableRowHeight;

            document
                .moveTo(tableLeft, afterRowY)
                .lineTo(tableLeft + contentWidth, afterRowY)
                .strokeColor(borderColor)
                .lineWidth(0.5)
                .stroke();

            // ---------- TOTAL SECTION ----------
            const totalsTop = afterRowY + 16;
            const totalsWidth = 200;
            const totalsLeft = 50 + contentWidth - totalsWidth;

            // Subtotal
            document
                .font("Helvetica")
                .fontSize(10)
                .fillColor(textMuted)
                .text("Subtotal", totalsLeft, totalsTop, {
                    width: 100,
                    align: "left"
                })
                .fillColor(textDark)
                .text(
                    formatCurrency(invoiceData.totalAmount),
                    totalsLeft + 100,
                    totalsTop,
                    {
                        width: 100,
                        align: "right"
                    }
                );

            // Total
            const totalRowY = totalsTop + 20;

            document
                .font("Helvetica-Bold")
                .fontSize(11)
                .fillColor(textDark)
                .text("Total", totalsLeft, totalRowY, {
                    width: 100,
                    align: "left"
                })
                .text(
                    formatCurrency(invoiceData.totalAmount),
                    totalsLeft + 100,
                    totalRowY,
                    {
                        width: 100,
                        align: "right"
                    }
                );

            // ---------- FOOTER ----------
            document
                .font("Helvetica")
                .fontSize(9)
                .fillColor("#9CA3AF")
                .text(
                    "Thank you for choosing PH Tour. This is a system generated invoice and does not require a signature.",
                    50,
                    document.page.height - 80,
                    {
                        width: contentWidth,
                        align: "center"
                    }
                );

            // ---------- Save PDF to Disk ----------
            document.end();
        });
    }
    catch (error) {
        consolePrint(error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to generate invoice PDF");
    }
};
