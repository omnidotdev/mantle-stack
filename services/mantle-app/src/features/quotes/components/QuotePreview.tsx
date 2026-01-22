import React from 'react';

interface Feature {
  id: string;
  name: string;
  price: number;
  is_custom: boolean;
  royalty_percentage?: number;
  royalty_timeframe?: number;
  royalty_timeframe_unit?: 'months' | 'years' | 'perpetual';
  pricing_type: 'fixed' | 'royalty' | 'hourly';
  royalty_threshold?: number;
  royalty_buyout_amount?: number;
  hourly_rate?: number;
  weekly_cap_hours?: number;
  monthly_cap_hours?: number;
  max_cap_hours?: number;
  monthly_hours_used?: number;
  last_reset_date?: string;
}

interface QuotePreviewProps {
  projectName: string;
  projectDescription: string;
  projectType: string;
  basePrice: number;
  totalPrice: number;
  timeRange: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  features: Feature[];
  quoteNumber?: string;
  additionalTerms?: string[];
}

export default function QuotePreview({
  projectName,
  projectDescription,
  projectType,
  basePrice,
  totalPrice,
  timeRange,
  clientName,
  clientCompany,
  clientEmail,
  features,
  quoteNumber,
  additionalTerms = []
}: QuotePreviewProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTimeRange = (range: string) => {
    const [value, unit] = range.split(' ');
    const numValue = parseInt(value);
    
    // Handle singular/plural cases
    if (numValue === 1) {
      if (unit === 'months') return '1 month';
      if (unit === 'weeks') return '1 week';
      if (unit === 'days') return '1 day';
      if (unit === 'years') return '1 year';
    }
    
    return range;
  };

  const formatRoyalty = (feature: Feature) => {
    if (!feature.royalty_percentage || !feature.royalty_timeframe_unit) return null;
    
    const percentage = `${feature.royalty_percentage}%`;
    let terms = '';
    
    if (feature.royalty_timeframe_unit === 'perpetual') {
      terms = `${percentage} in perpetuity`;
    } else {
      const timeframe = feature.royalty_timeframe || 0;
      const unit = timeframe === 1 
        ? feature.royalty_timeframe_unit.slice(0, -1) // Remove 's' for singular
        : feature.royalty_timeframe_unit;
      terms = `${percentage} for ${timeframe} ${unit}`;
    }

    if (feature.royalty_threshold) {
      terms += ` OR until total royalties reach $${feature.royalty_threshold.toLocaleString()}, whichever comes first`;
    }

    if (feature.royalty_buyout_amount) {
      terms += `. Client can buy out early for $${feature.royalty_buyout_amount.toLocaleString()}.`;
    }

    return terms;
  };

  const formatHourly = (feature: Feature) => {
    if (!feature.hourly_rate) return null;
    
    let terms = '';
    
    if (feature.weekly_cap_hours) {
      const weeklyMax = feature.hourly_rate * feature.weekly_cap_hours;
      terms = `$${feature.hourly_rate}/hr, up to ${feature.weekly_cap_hours} hours per week (max $${weeklyMax.toLocaleString()}/week)`;
    }
    
    if (feature.monthly_cap_hours) {
      const monthlyMax = feature.hourly_rate * feature.monthly_cap_hours;
      terms += terms ? `, ` : `$${feature.hourly_rate}/hr `;
      terms += `up to ${feature.monthly_cap_hours} hours per month (max $${monthlyMax.toLocaleString()}/month)`;
    }
    
    if (feature.max_cap_hours) {
      const totalMax = feature.hourly_rate * feature.max_cap_hours;
      terms += `$${feature.hourly_rate}/hr, maximum of ${feature.max_cap_hours} total hours (max $${totalMax.toLocaleString()})`;
    }
    
    return terms;
  };

  const getFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    const cleanProjectName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = quoteNumber ? `-${quoteNumber.toLowerCase()}` : '';
    return `omni-quote-${cleanProjectName}${id}-${date}`;
  };

  const printQuote = () => {
    const originalTitle = document.title;
    document.title = getFilename();
    window.print();
    document.title = originalTitle;
  };

  const hasRoyaltyFeatures = () => {
    return features.some(feature => feature.pricing_type === 'royalty');
  };

  const hasHourlyFeatures = () => {
    return features.some(feature => feature.pricing_type === 'hourly' && feature.monthly_cap_hours);
  };

  const getHighestBuyoutAmount = () => {
    return features
      .filter(f => f.pricing_type === 'royalty' && f.royalty_buyout_amount)
      .reduce((max, f) => Math.max(max, f.royalty_buyout_amount || 0), 0);
  };

  const calculateFixedTotal = () => {
    const fixedFeatures = features.filter(f => f.pricing_type === 'fixed');
    const fixedTotal = fixedFeatures.reduce((sum, f) => sum + f.price, 0);
    return basePrice + fixedTotal;
  };

  const calculateMaxHourlyTotal = () => {
    return features
      .filter(f => f.pricing_type === 'hourly' && f.hourly_rate && f.monthly_cap_hours)
      .reduce((sum, f) => {
        const monthlyMax = (f.hourly_rate || 0) * (f.monthly_cap_hours || 0);
        if (f.max_cap_hours) {
          const totalMax = (f.hourly_rate || 0) * f.max_cap_hours;
          return sum + Math.min(monthlyMax, totalMax);
        }
        return sum + monthlyMax;
      }, 0);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={printQuote}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-omni-600 rounded-md hover:bg-omni-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-omni-500 print:hidden"
      >
        Print Quote
      </button>

      <div className="overflow-auto max-h-[calc(100vh-8rem)] print:max-h-none print:overflow-visible">
        <div id="quote-preview" className="bg-white w-[210mm] mx-auto print:w-full print:mx-0">
          <div className="bg-gradient-to-r from-omni-600 to-omni-800 p-8 print:bg-omni-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="/omni-logo.png" 
                  alt="Omni LLC" 
                  className="h-8 w-auto [filter:brightness(0)_invert(1)]" 
                  style={{ filter: 'brightness(0) invert(1)' }}
                  crossOrigin="anonymous"
                />
                <h3 className="ml-4 text-xl font-bold text-white">Quote for Professional Software Development Services</h3>
              </div>
              <div className="text-right min-w-fit pl-4">
                <p className="text-omni-100 text-sm">Date prepared: {formatDate(new Date())}</p>
                <p className="text-omni-100 text-sm">Quote ID: {quoteNumber || 'DRAFT'}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Prepared By</h4>
                <p className="font-medium">Brian Cooper</p>
                <p className="font-medium">Omni LLC</p>
                <p className="text-gray-600">brian@omni.dev</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Prepared For</h4>
                <p className="font-medium">{clientName}</p>
                {clientCompany && <p className="font-medium">{clientCompany}</p>}
                <p className="text-gray-600">{clientEmail}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Project Overview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Project Name</p>
                  <p className="font-medium">{projectName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Project Type</p>
                  <p className="font-medium">{projectType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="font-medium whitespace-pre-wrap">{projectDescription}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Estimated Timeline</p>
                  <p className="text-sm text-gray-600 italic mb-2">
                    This is a rough estimate based on the current project scope and requirements. The final time estimate may vary as the project develops and requirements are refined.
                  </p>
                  <p className="font-medium">{formatTimeRange(timeRange)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h4>
              <div className="space-y-3">
                <div className="bg-omni-50 p-4 print:border print:border-gray-200">
                  <div className="grid grid-cols-[1fr,auto,auto] gap-4 items-center">
                    <div className="font-medium text-gray-700">Base Development Cost</div>
                    <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-omni-100 text-omni-800 whitespace-nowrap print:border print:border-omni-200">
                      Fixed Price
                    </div>
                    <div className="font-medium text-right whitespace-nowrap">${basePrice.toLocaleString()}</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Includes project setup, core development, testing, deployment, and 30 days of as-needed post-launch maintenance and support.
                  </p>
                </div>

                {features.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">Additional Features</h5>
                    {features.map((feature) => (
                      <div key={feature.id} className="bg-omni-50 p-4 print:border print:border-gray-200">
                        <div className="grid grid-cols-[1fr,auto,auto] gap-4 items-center">
                          <div className="font-medium text-gray-700">{feature.name}</div>
                          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap print:border ${
                            feature.pricing_type === 'fixed' 
                              ? 'bg-omni-100 text-omni-800 print:border-omni-200' 
                              : feature.pricing_type === 'royalty'
                              ? 'bg-purple-100 text-purple-800 print:border-purple-200'
                              : 'bg-blue-100 text-blue-800 print:border-blue-200'
                          }`}>
                            {feature.pricing_type === 'fixed' ? 'Fixed Price' : 
                             feature.pricing_type === 'royalty' ? 'Royalty' : 'Hourly'}
                          </div>
                          {feature.pricing_type === 'fixed' ? (
                            <div className="font-medium text-right whitespace-nowrap">
                              ${feature.price.toLocaleString()}
                            </div>
                          ) : feature.pricing_type === 'hourly' ? (
                            <div className="font-medium text-right whitespace-nowrap">
                              ${feature.hourly_rate}/hr
                            </div>
                          ) : (
                            <div className="text-right whitespace-nowrap">&mdash;</div>
                          )}
                        </div>
                        {feature.pricing_type === 'royalty' && formatRoyalty(feature) && (
                          <p className="mt-2 text-sm text-gray-600">
                            Royalty: {formatRoyalty(feature)}
                          </p>
                        )}
                        {feature.pricing_type === 'hourly' && formatHourly(feature) && (
                          <p className="mt-2 text-sm text-gray-600">
                            Rate: {formatHourly(feature)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
                    <span className="font-bold text-gray-900">Total Investment</span>
                    <div className="text-right">
                      <span className="font-bold text-omni-600 text-2xl">
                        ${calculateFixedTotal().toLocaleString()}
                      </span>
                      {hasHourlyFeatures() && (
                        <div className="text-sm text-gray-600 mt-1">
                          + hourly services (maximum ${calculateMaxHourlyTotal().toLocaleString()}/mo)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Terms & Conditions</h4>     
              <p className="text-sm text-gray-600 italic mb-4">
               This quote is not legally binding and is subject to a formal agreement. If the client accepts this quote, a separate contract governing all legally binding terms will be prepared for signature.
              </p>
              
              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>
                  <span className="font-medium">Validity:</span> This quote is valid for 30 days from the 
                  date of issue.
                </li>
                <li>
                  <span className="font-medium">Payment Terms:</span> $0 upfront, per-item invoices sent 
                  as they are completed. Invoices may bundle completed items. Invoices to be paid by the 
                  client within 30 days of the invoice date. Late payments will incur a 5% late fee per month, 
                  and all work will be paused until outstanding invoices are settled. All prices are in USD 
                  and exclude any applicable taxes.
                </li>
                <li>
                  <span className="font-medium">Timeline:</span> Estimated delivery within {formatTimeRange(timeRange)}{" "} 
                  from project kickoff.
                </li>
                <li>
                  <span className="font-medium">External Provider Costs:</span> The client is expected to 
                  pay for external platform costs, such as web hosting and domain name registration. 
                  Omni LLC will assist in the setup of these platforms.
                </li>
                <li>
                  <span className="font-medium">Maintenance:</span> Includes bug fixes and security patches 
                  for 30 days post-launch. New features, enhancements, or integrations require a separate 
                  quote and agreement. A separate maintenance contract can be established for further bug fix and patch needs.
                </li>
                {hasRoyaltyFeatures() && (
                  <li>
                    <span className="font-medium">Royalty-Based Maintenance Support:</span> While the royalty 
                    agreement is in effect, Omni LLC will provide up to 10 free hours per month of maintenance, 
                    including bug fixes and minor updates. Any additional maintenance or new feature development 
                    will require a separate agreement.
                    {getHighestBuyoutAmount() > 0 && (
                      <span>
                        {" "}If the client exercises the buyout option on a royalty, 
                        all future maintenance and updates will be billed at Omni LLC's standard hourly rate.
                      </span>
                    )}
                  </li>
                )}
                {hasHourlyFeatures() && (
                  <li>
                    <span className="font-medium">Monthly Hour Caps:</span> For hourly rate services with monthly caps, 
                    the available hours reset on the first day of each calendar month. Unused hours from the previous 
                    month do not roll over.
                  </li>
                )}
                <li>
                  <span className="font-medium">Scope:</span> The items outlined in this quote are strictly 
                  defined. Any additional work beyond these can be quoted separately and appended to a 
                  separate working contract.
                </li>
                {additionalTerms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="text-center">
                <p className="font-medium text-gray-700 mb-4">
                  We appreciate the opportunity to work with you and look forward to bringing your vision to life.
                </p>
                <div className="flex items-center justify-center">
                  <img 
                    src="/omni-logo.png" 
                    alt="Omni LLC" 
                    className="h-6 w-auto [filter:brightness(0)_opacity(0.8)]" 
                    style={{ filter: 'brightness(0) opacity(0.8)' }}
                    crossOrigin="anonymous"
                  />
                  <span className="ml-2 font-bold text-gray-900">Omni LLC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}