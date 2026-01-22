import React from 'react';

interface ClientDetailsFormProps {
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  onChange: (field: string, value: string) => void;
}

export default function ClientDetailsForm({
  clientName,
  clientCompany,
  clientEmail,
  onChange,
}: ClientDetailsFormProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client Name
          </label>
          <input
            type="text"
            required
            value={clientName}
            onChange={(e) => onChange('client_name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client Company
          </label>
          <input
            type="text"
            value={clientCompany}
            onChange={(e) => onChange('client_company', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client Email
          </label>
          <input
            type="email"
            required
            value={clientEmail}
            onChange={(e) => onChange('client_email', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
          />
        </div>
      </div>
    </div>
  );
}