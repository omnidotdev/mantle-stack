import { formatNumber } from "@/types/invoice";

import type React from "react";
import type { Invoice, InvoiceItem } from "@/types/invoice";

interface InvoiceFormProps {
  invoice: Invoice;
  onInvoiceChange: (invoice: Invoice) => void;
  onAddLineItem: () => void;
  calculateTotal: () => number;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onInvoiceChange,
  onAddLineItem,
  calculateTotal,
}) => {
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onInvoiceChange({
      ...invoice,
      company: {
        ...invoice.company,
        [name]: value,
      },
    });
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInvoiceChange({
      ...invoice,
      client: {
        billTo: e.target.value,
      },
    });
  };

  const handleInvoiceDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    onInvoiceChange({
      ...invoice,
      [name]: value,
    });
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    const updatedItems = invoice.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate amount if hours or rate changes
        if (field === "hours" || field === "rate") {
          const hours = field === "hours" ? Number(value) : item.hours;
          const rate = field === "rate" ? Number(value) : item.rate;
          updatedItem.amount = hours * rate;
        }

        return updatedItem;
      }
      return item;
    });

    onInvoiceChange({
      ...invoice,
      items: updatedItems,
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInvoiceChange({
      ...invoice,
      notes: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-medium text-gray-700 text-lg">Your Information</h2>
        <label className="block font-medium text-gray-700 text-sm">
          Company Name
          <input
            type="text"
            name="name"
            value={invoice.company.name}
            onChange={handleCompanyChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </label>
        <label className="block font-medium text-gray-700 text-sm">
          Address
          <input
            type="text"
            name="address"
            value={invoice.company.address}
            onChange={handleCompanyChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </label>
        <label className="block font-medium text-gray-700 text-sm">
          City, State, ZIP
          <input
            type="text"
            name="cityStateZip"
            value={invoice.company.cityStateZip}
            onChange={handleCompanyChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </label>
      </div>

      <div className="space-y-4">
        <h2 className="font-medium text-gray-700 text-lg">
          Client Information
        </h2>
        <label className="block font-medium text-gray-700 text-sm">
          Bill To
          <textarea
            value={invoice.client.billTo}
            onChange={handleClientChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Client Name&#10;Address&#10;City, State ZIP"
          />
        </label>
      </div>

      <div className="space-y-4">
        <h2 className="font-medium text-gray-700 text-lg">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="block font-medium text-gray-700 text-sm">
            Invoice ID
            <input
              type="text"
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleInvoiceDetailChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </label>
          <label className="block font-medium text-gray-700 text-sm">
            Invoice Date
            <input
              type="text"
              name="invoiceDate"
              value={invoice.invoiceDate}
              onChange={handleInvoiceDetailChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-medium text-gray-700 text-lg">Line Items</h2>
        {invoice.items.map((item) => (
          <div key={item.id} className="space-y-2">
            <label className="block font-medium text-gray-700 text-sm">
              Description
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(item.id, "description", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className="block font-medium text-gray-700 text-sm">
                Hours/Items
                <input
                  type="number"
                  value={item.hours}
                  onChange={(e) =>
                    handleItemChange(item.id, "hours", Number(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </label>
              <label className="block font-medium text-gray-700 text-sm">
                Rate ($)
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(item.id, "rate", Number(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </label>
              <label className="block font-medium text-gray-700 text-sm">
                Amount ($)
                <input
                  type="text"
                  value={formatNumber(item.amount)}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                />
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddLineItem}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          <span>+ Add Line Item</span>
        </button>
        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${formatNumber(calculateTotal())}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-medium text-gray-700 text-lg">Notes</h2>
        <textarea
          value={invoice.notes}
          onChange={handleNotesChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        ></textarea>
      </div>
    </div>
  );
};

export default InvoiceForm;
