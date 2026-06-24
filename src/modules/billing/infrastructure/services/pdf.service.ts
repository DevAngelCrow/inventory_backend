import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { InvoiceDto } from '../../application/dtos/invoice.dto';

@Injectable()
export class PdfService {
  async generateInvoicePdf(invoice: InvoiceDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        doc
          .fillColor('#444444')
          .fontSize(20)
          .text('FACTURA', 50, 57, { align: 'right' })
          .fontSize(10)
          .text(`Factura N°: ${invoice.invoice_number}`, { align: 'right' })
          .text(`Fecha: ${invoice.issue_date.toLocaleDateString()}`, {
            align: 'right',
          })
          .text(
            `Vencimiento: ${invoice.due_date?.toLocaleDateString() || '-'}`,
            { align: 'right' },
          )
          .moveDown();

        doc
          .fontSize(10)
          .text('Empresa Alquileres S.A.', 50, 57)
          .text('123 Calle Falsa')
          .text('Ciudad, País, 12345')
          .moveDown();

        // Customer Info
        doc.fillColor('#000000').fontSize(12).text('Facturar a:', 50, 130);

        if (invoice.mnt_customer) {
          doc
            .fontSize(10)
            .text(
              `${invoice.mnt_customer.first_name} ${invoice.mnt_customer.last_name}`,
            )
            .text(invoice.mnt_customer.email || '')
            .text(invoice.mnt_customer.phone || '');
        } else {
          doc.fontSize(10).text('Cliente no especificado');
        }

        doc.moveDown(2);

        // Table Header
        let i = 200;
        doc
          .fontSize(10)
          .text('Descripción', 50, i)
          .text('Cant', 280, i, { width: 50, align: 'right' })
          .text('Precio U.', 350, i, { width: 70, align: 'right' })
          .text('Subtotal', 450, i, { width: 70, align: 'right' });

        doc
          .strokeColor('#aaaaaa')
          .lineWidth(1)
          .moveTo(50, i + 15)
          .lineTo(520, i + 15)
          .stroke();

        i += 25;

        // Table Rows
        invoice.lines.forEach((line) => {
          doc
            .fontSize(10)
            .text(line.description, 50, i)
            .text(line.quantity.toString(), 280, i, {
              width: 50,
              align: 'right',
            })
            .text(`$${Number(line.unit_price).toFixed(2)}`, 350, i, {
              width: 70,
              align: 'right',
            })
            .text(`$${Number(line.subtotal).toFixed(2)}`, 450, i, {
              width: 70,
              align: 'right',
            });
          i += 20;
        });

        doc
          .strokeColor('#aaaaaa')
          .lineWidth(1)
          .moveTo(50, i)
          .lineTo(520, i)
          .stroke();

        i += 15;

        // Totals
        doc
          .fontSize(10)
          .text('Subtotal:', 350, i, { width: 70, align: 'right' })
          .text(`$${Number(invoice.subtotal).toFixed(2)}`, 450, i, {
            width: 70,
            align: 'right',
          });

        i += 15;
        doc
          .text('Impuestos:', 350, i, { width: 70, align: 'right' })
          .text(`$${Number(invoice.tax_amount).toFixed(2)}`, 450, i, {
            width: 70,
            align: 'right',
          });

        i += 15;
        if (Number(invoice.discount_amount) > 0) {
          doc
            .text('Descuento:', 350, i, { width: 70, align: 'right' })
            .text(`-$${Number(invoice.discount_amount).toFixed(2)}`, 450, i, {
              width: 70,
              align: 'right',
            });
          i += 15;
        }

        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('Total:', 350, i + 5, { width: 70, align: 'right' })
          .text(`$${Number(invoice.total).toFixed(2)}`, 450, i + 5, {
            width: 70,
            align: 'right',
          });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
