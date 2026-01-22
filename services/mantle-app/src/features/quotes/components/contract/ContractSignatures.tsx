import React from 'react';

interface ContractSignaturesProps {
  clientName: string;
  clientCompany: string;
}

export default function ContractSignatures({ clientName, clientCompany }: ContractSignaturesProps) {
  return (
    <section>
      <p className="mb-6">
        By signing below, both parties agree to the terms outlined in this Agreement.
      </p>
      <div className="grid grid-cols-2 gap-12 mt-8 text-sm">
        <div className="flex flex-col">
          <p className="font-bold mb-4">Omni LLC</p>
          <div className="border-b border-gray-400 mb-6"></div>
          <div className="grid gap-4">
            <p>Signature: ________________________</p>
            <p>Name: Brian Cooper</p>
            <p>Title: CEO</p>
            <p>Date: ________________________</p>
          </div>
        </div>

        <div className="flex flex-col">
          <p className="font-bold mb-4">{clientCompany || clientName}</p>
          <div className="border-b border-gray-400 mb-6"></div>
          <div className="grid gap-4">
            <p>Signature: ________________________</p>
            <p>Name: {clientName}</p>
            <p>Title: ________________________</p>
            <p>Date: ________________________</p>
          </div>
        </div>
      </div>
    </section>
  );
}