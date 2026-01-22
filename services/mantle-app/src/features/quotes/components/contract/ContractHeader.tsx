import React from 'react';

interface ContractHeaderProps {
  quoteNumber: string | undefined;
  formatDate: (date: Date) => string;
}

export default function ContractHeader({ quoteNumber, formatDate }: ContractHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-omni-600 to-omni-800 p-8 print:bg-omni-600">
      <div className="grid grid-cols-[1fr,auto] gap-8 items-center">
        <div className="flex items-center gap-4 min-w-0">
          <img 
            src="/omni-logo.png" 
            alt="Omni LLC" 
            className="h-8 w-auto flex-shrink-0 [filter:brightness(0)_invert(1)]" 
            style={{ filter: 'brightness(0) invert(1)' }}
            crossOrigin="anonymous"
          />
          <h3 className="text-xl font-bold text-white truncate">Software Development Agreement</h3>
        </div>
        <div className="text-right whitespace-nowrap">
          <p className="text-omni-100 text-sm">Date: {formatDate(new Date())}</p>
          <p className="text-omni-100 text-sm">Contract ID: {quoteNumber || 'DRAFT'}</p>
        </div>
      </div>
    </div>
  );
}