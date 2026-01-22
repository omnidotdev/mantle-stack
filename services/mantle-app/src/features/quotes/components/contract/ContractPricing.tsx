import React from 'react';
import { Feature } from '../../types/contract';

interface ContractPricingProps {
  basePrice: number;
  features: Feature[];
  formatRoyalty: (feature: Feature) => string | null;
  formatHourly: (feature: Feature) => string | null;
  calculateFixedTotal: () => number;
  calculateMaxHourlyTotal: () => number;
  hasHourlyFeatures: () => boolean;
}

export default function ContractPricing({
  basePrice,
  features,
  formatRoyalty,
  formatHourly,
  calculateFixedTotal,
  calculateMaxHourlyTotal,
  hasHourlyFeatures
}: ContractPricingProps) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-2">2. Payment Terms</h2>
  <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>No upfront payment is required. Invoices will be sent for completed items and may bundle multiple completed components.</li>
          <li>All invoices must be paid within 30 days of the invoice date.</li>
          <li>Late payments will incur a 5% late fee per month, and all work will be paused until outstanding invoices are settled.</li>
          <li>All prices are in USD and exclude any applicable taxes.</li>
          {hasHourlyFeatures() && (
            <li>For hourly rate services with monthly caps, available hours reset on the first day of each calendar month. Unused hours from the previous month do not roll over.</li>
          )}
        </ul>
      
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3">Project Components and Pricing:</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr,auto] gap-4 pb-2 border-b border-gray-200">
              <span>Base Development Package</span>
              <span className="font-medium text-right">${basePrice.toLocaleString()}</span>
            </div>
            {features.map(feature => (
              <div key={feature.id} className="grid grid-cols-[1fr,auto] gap-4">
                <div>
                  <span>{feature.name}</span>
                  {feature.pricing_type === 'hourly' && feature.hourly_rate && (
                    <p className="text-sm text-gray-600">
                      {formatHourly(feature)}
                    </p>
                  )}
                  {feature.pricing_type === 'royalty' && feature.royalty_percentage && (
                    <p className="text-sm text-gray-600">
                      {formatRoyalty(feature)}
                    </p>
                  )}
                </div>
                <span className="text-right">
                  {feature.pricing_type === 'fixed' && `$${feature.price.toLocaleString()}`}
                  {feature.pricing_type === 'hourly' && `Hourly Rate`}
                  {feature.pricing_type === 'royalty' && `Revenue Share`}
                </span>
              </div>
            ))}
            <div className="grid grid-cols-[1fr,auto] gap-4 pt-2 border-t border-gray-200">
              <span className="font-bold">Total Fixed Cost</span>
              <span className="font-bold text-right">${calculateFixedTotal().toLocaleString()}</span>
            </div>
            {hasHourlyFeatures() && (
              <div className="text-sm text-gray-600 mt-1">
                + Hourly services not to exceed ${calculateMaxHourlyTotal().toLocaleString()}/month
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}