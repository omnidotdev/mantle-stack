import React from 'react';

interface TotalPriceDisplayProps {
  total: number;
}

export default function TotalPriceDisplay({ total }: TotalPriceDisplayProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Total Price</h2>
        <p className="text-2xl font-bold text-omni-600">
          ${total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}