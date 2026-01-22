export interface InvoiceItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  company: {
    name: string;
    address: string;
    cityStateZip: string;
  };
  client: {
    billTo: string;
  };
  invoiceNumber: string;
  invoiceDate: string;
  items: InvoiceItem[];
  notes: string;
}

// Helper function to generate current date in a readable format
const getCurrentDate = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return now.toLocaleDateString("en-US", options);
};

// Helper function to generate timestamp-based invoice ID
const generateInvoiceId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `INV-${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export const defaultInvoice: Invoice = {
  company: {
    name: "",
    address: "",
    cityStateZip: "",
  },
  client: {
    billTo: "",
  },
  invoiceNumber: generateInvoiceId(),
  invoiceDate: getCurrentDate(),
  items: [
    {
      id: "1",
      description: "",
      hours: 1,
      rate: 0,
      amount: 0,
    },
  ],
  notes: "",
};

// Helper function to format numbers with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
