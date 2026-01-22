import React from 'react';

interface ContractPartiesProps {
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  formatDate: (date: Date) => string;
}

export default function ContractParties({ 
  clientName, 
  clientCompany, 
  clientEmail,
  formatDate 
}: ContractPartiesProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-800">
        This Software Development Agreement ("Agreement") is entered into as of {formatDate(new Date())} between:
      </p>

      <div className="space-y-4">
        <p>
          <strong>Omni LLC</strong>, a company registered in Minnesota ("Developer"), and
        </p>

        <p>
          <strong>{clientName}</strong>
          {clientCompany && ` of ${clientCompany}`} ("Client").
        </p>
      </div>
    </div>
  );
}