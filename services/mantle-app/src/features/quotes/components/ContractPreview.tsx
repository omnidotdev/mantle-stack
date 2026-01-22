import React from 'react';
import { Feature } from '../types/contract';
import ContractHeader from './contract/ContractHeader';
import ContractParties from './contract/ContractParties';
import ContractScope from './contract/ContractScope';
import ContractPricing from './contract/ContractPricing';
import ContractTerms from './contract/ContractTerms';
import ContractLegal from './contract/ContractLegal';
import ContractSignatures from './contract/ContractSignatures';

interface ContractPreviewProps {
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

export default function ContractPreview({
  projectName,
  projectDescription,
  projectType,
  basePrice,
  timeRange,
  clientName,
  clientCompany,
  clientEmail,
  features,
  quoteNumber,
  additionalTerms = []
}: ContractPreviewProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
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
        ? feature.royalty_timeframe_unit.slice(0, -1)
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
    
    let terms = `$${feature.hourly_rate}/hr`;
    
    if (feature.max_cap_hours && !feature.weekly_cap_hours && !feature.monthly_cap_hours) {
      return `${terms} (max ${feature.max_cap_hours}hrs total, $${(feature.hourly_rate * feature.max_cap_hours).toLocaleString()} total)`;
    }
    
    let caps = [];
    
    if (feature.weekly_cap_hours) {
      const weeklyMax = feature.hourly_rate * feature.weekly_cap_hours;
      caps.push(`up to ${feature.weekly_cap_hours}hrs/week ($${weeklyMax.toLocaleString()}/week)`);
    }
    
    if (feature.monthly_cap_hours) {
      const monthlyMax = feature.hourly_rate * feature.monthly_cap_hours;
      caps.push(`up to ${feature.monthly_cap_hours}hrs/month ($${monthlyMax.toLocaleString()}/month)`);
    }
    
    if (feature.max_cap_hours) {
      const totalMax = feature.hourly_rate * feature.max_cap_hours;
      caps.push(`maximum ${feature.max_cap_hours}hrs total ($${totalMax.toLocaleString()} total)`);
    }
    
    return caps.length > 0 ? `${terms}, ${caps.join(', ')}` : terms;
  };

  const getFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    const cleanProjectName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = quoteNumber ? `-${quoteNumber.toLowerCase()}` : '';
    return `omni-contract-${cleanProjectName}${id}-${date}`;
  };

  const printContract = () => {
    const originalTitle = document.title;
    document.title = getFilename();
    window.print();
    document.title = originalTitle;
  };

  const hasRoyaltyFeatures = () => {
    return features.some(feature => feature.pricing_type === 'royalty');
  };

  const hasHourlyFeatures = () => {
    return features.some(feature => feature.pricing_type === 'hourly');
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
        onClick={printContract}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-omni-600 rounded-md hover:bg-omni-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-omni-500 print:hidden"
      >
        Print Contract
      </button>

      <div className="overflow-auto max-h-[calc(100vh-8rem)] print:max-h-none print:overflow-visible">
        <div id="contract-preview" className="bg-white w-[215.9mm] mx-auto print:w-full print:mx-0">
          <ContractHeader 
            quoteNumber={quoteNumber}
            formatDate={formatDate}
          />

          <div className="p-8 space-y-6">
            <ContractParties
              clientName={clientName}
              clientCompany={clientCompany}
              clientEmail={clientEmail}
              formatDate={formatDate}
            />

            <ContractScope
              projectName={projectName}
              projectType={projectType}
              projectDescription={projectDescription}
            />

            <ContractPricing
              basePrice={basePrice}
              features={features}
              formatRoyalty={formatRoyalty}
              formatHourly={formatHourly}
              calculateFixedTotal={calculateFixedTotal}
              calculateMaxHourlyTotal={calculateMaxHourlyTotal}
              hasHourlyFeatures={hasHourlyFeatures}
            />

            <ContractTerms
              getHighestBuyoutAmount={getHighestBuyoutAmount}
              hasRoyaltyFeatures={hasRoyaltyFeatures}
              hasHourlyFeatures={hasHourlyFeatures}
              additionalTerms={additionalTerms}
              timeRange={timeRange}
            />

            <ContractLegal />

            <ContractSignatures
              clientName={clientName}
              clientCompany={clientCompany}
            />
          </div>
        </div>
      </div>
    </div>
  );
}