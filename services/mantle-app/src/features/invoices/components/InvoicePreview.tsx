import { Plus } from "lucide-react";

import { formatNumber } from "@/types/invoice";

import type { Invoice } from "@/types/invoice";

interface InvoicePreviewProps {
  invoice: Invoice;
  total: number;
  onAddLineItem: () => void;
  showHoursAndRate: boolean;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  total,
  onAddLineItem,
  showHoursAndRate,
}) => {
  // Format the billTo text with line breaks for HTML display
  const formattedBillTo = invoice.client.billTo ? (
    invoice.client.billTo.split("\n").map((line, i) => (
      <p key={i} className={i === 0 ? "text-gray-800" : "text-gray-600"}>
        {line}
      </p>
    ))
  ) : (
    <p className="text-gray-800">Client Name</p>
  );

  // Format notes with line breaks for HTML display
  const formattedNotes = invoice.notes
    ? invoice.notes.split("\n").map((line, i) => (
        <p key={i} className="text-gray-600">
          {line}
        </p>
      ))
    : null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm print:border-0 print:shadow-none">
      {/* Gradient Header */}
      <div className="rounded-t-lg bg-linear-to-r from-teal-700 to-teal-500 p-6 text-white print:rounded-none">
        <div className="mb-2 flex justify-between">
          <div className="flex items-start gap-3">
            {/* Logo with brightness(0) invert(1) filter */}
            <img
              src="/omni-logo.png"
              alt="Omni Logo"
              className="h-12 w-12 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <div>
              <h3 className="font-bold text-white text-xl">
                {invoice.company.name || "Your Company"}
              </h3>
              <p className="text-teal-100">
                {invoice.company.address || "Address"}
              </p>
              <p className="text-teal-100">
                {invoice.company.cityStateZip || "City, State, ZIP"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="font-bold text-4xl text-white">INVOICE</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h4 className="mb-2 font-bold text-gray-700">Bill To:</h4>
            {formattedBillTo}
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <span className="font-bold text-gray-700">Invoice ID:</span>
              <span className="text-gray-600">
                {invoice.invoiceNumber || "INV-001"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">Invoice Date:</span>
              <span className="text-gray-600">
                {invoice.invoiceDate || "Date"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-4 py-2 text-left">Item Description</th>
                {showHoursAndRate && (
                  <>
                    <th className="px-4 py-2 text-right">Hours/Items</th>
                    <th className="px-4 py-2 text-right">Rate ($)</th>
                  </>
                )}
                <th className="px-4 py-2 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(
                (item) =>
                  item.description && (
                    <tr key={item.id} className="border-gray-200 border-b">
                      <td className="px-4 py-3 text-gray-800">
                        {item.description}
                      </td>
                      {showHoursAndRate && (
                        <>
                          <td className="px-4 py-3 text-right text-gray-800">
                            {item.hours}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-800">
                            {formatNumber(item.rate)}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3 text-right text-gray-800">
                        {formatNumber(item.amount)}
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>

          <button
            type="button"
            onClick={onAddLineItem}
            className="pdf-hide mt-4 flex items-center gap-1 text-teal-600 hover:text-teal-700"
          >
            <Plus size={18} />
            <span>Add Line Item</span>
          </button>

          <div className="mt-6 flex justify-end">
            <div className="w-1/3 rounded bg-teal-100 p-3">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>${formatNumber(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div>
            <h4 className="mb-2 font-bold text-gray-700">Notes:</h4>
            <div className="text-gray-600">{formattedNotes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;
