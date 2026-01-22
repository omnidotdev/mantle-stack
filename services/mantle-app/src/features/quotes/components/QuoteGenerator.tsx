import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import QuotePreview from './QuotePreview';
import ContractPreview from './ContractPreview';
import ProjectDetailsForm from './forms/ProjectDetailsForm';
import ClientDetailsForm from './forms/ClientDetailsForm';
import AdditionalTermsForm from './forms/AdditionalTermsForm';
import TotalPriceDisplay from './forms/TotalPriceDisplay';
import PreviewToggle from './forms/PreviewToggle';

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

interface Quote {
  project_name: string;
  project_description: string;
  project_type: string;
  base_price: number;
  total_price: number;
  time_value: number;
  time_unit: string;
  client_name: string;
  client_company: string;
  client_email: string;
  features: Feature[];
  additional_terms?: string[];
}

export default function QuoteGenerator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState<'quote' | 'contract'>('quote');
  const [newTerm, setNewTerm] = useState('');
  const [quote, setQuote] = useState<Quote>({
    project_name: '',
    project_description: '',
    project_type: 'web',
    base_price: 0,
    total_price: 0,
    time_value: 2,
    time_unit: 'weeks',
    client_name: '',
    client_company: '',
    client_email: '',
    features: [],
    additional_terms: []
  });

  const handleFieldChange = (field: string, value: string | number) => {
    setQuote(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setQuote({
      ...quote,
      features: [
        ...quote.features,
        {
          id: crypto.randomUUID(),
          name: '',
          price: 0,
          is_custom: true,
          royalty_percentage: undefined,
          royalty_timeframe: undefined,
          royalty_timeframe_unit: undefined,
          pricing_type: 'fixed',
          royalty_threshold: undefined,
          royalty_buyout_amount: undefined,
          hourly_rate: undefined,
          weekly_cap_hours: undefined,
          monthly_cap_hours: undefined,
          max_cap_hours: undefined,
          monthly_hours_used: 0,
          last_reset_date: new Date().toISOString().split('T')[0]
        }
      ]
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...quote.features];
    updatedFeatures.splice(index, 1);
    setQuote({ ...quote, features: updatedFeatures });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string | number | boolean | undefined) => {
    const updatedFeatures = [...quote.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    setQuote({ ...quote, features: updatedFeatures });
  };

  const handlePricingTypeChange = (index: number, type: 'fixed' | 'royalty' | 'hourly') => {
    const updatedFeatures = [...quote.features];
    const feature = updatedFeatures[index];
    
    // Clear all pricing-specific fields
    feature.royalty_percentage = undefined;
    feature.royalty_timeframe = undefined;
    feature.royalty_timeframe_unit = undefined;
    feature.royalty_threshold = undefined;
    feature.royalty_buyout_amount = undefined;
    feature.hourly_rate = undefined;
    feature.weekly_cap_hours = undefined;
    feature.monthly_cap_hours = undefined;
    feature.max_cap_hours = undefined;
    feature.monthly_hours_used = 0;
    feature.last_reset_date = new Date().toISOString().split('T')[0];
    
    // Set type-specific defaults
    if (type === 'fixed') {
      feature.price = 0;
    } else if (type === 'royalty') {
      feature.royalty_percentage = 5;
      feature.royalty_timeframe = 12;
      feature.royalty_timeframe_unit = 'months';
      feature.price = 0;
    } else if (type === 'hourly') {
      feature.hourly_rate = 150;
      feature.weekly_cap_hours = 10;
      feature.monthly_cap_hours = 40;
      feature.max_cap_hours = 0;
      feature.price = 0;
    }
    
    feature.pricing_type = type;
    setQuote({ ...quote, features: updatedFeatures });
  };

  const handleRoyaltyUnitChange = (index: number, value: string) => {
    const feature = quote.features[index];
    if (!feature) return;

    if (value === '') {
      updateFeature(index, 'royalty_timeframe_unit', undefined);
      updateFeature(index, 'royalty_timeframe', undefined);
      updateFeature(index, 'royalty_percentage', undefined);
      updateFeature(index, 'royalty_threshold', undefined);
      updateFeature(index, 'royalty_buyout_amount', undefined);
    } else if (value === 'perpetual') {
      updateFeature(index, 'royalty_timeframe_unit', 'perpetual');
      updateFeature(index, 'royalty_timeframe', undefined);
      if (!feature.royalty_percentage) {
        updateFeature(index, 'royalty_percentage', 5);
      }
    } else {
      updateFeature(index, 'royalty_timeframe_unit', value as 'months' | 'years');
      if (!feature.royalty_timeframe) {
        updateFeature(index, 'royalty_timeframe', 12);
      }
      if (!feature.royalty_percentage) {
        updateFeature(index, 'royalty_percentage', 5);
      }
    }
  };

  const calculateTotal = () => {
    const featuresTotal = quote.features.reduce((sum, feature) => sum + feature.price, 0);
    return quote.base_price + featuresTotal;
  };

  const getTimeRange = () => {
    return `${quote.time_value} ${quote.time_unit}`;
  };

  const addTerm = () => {
    if (!newTerm.trim()) return;
    setQuote({
      ...quote,
      additional_terms: [...(quote.additional_terms || []), newTerm.trim()]
    });
    setNewTerm('');
  };

  const removeTerm = (index: number) => {
    if (!quote.additional_terms) return;
    const updatedTerms = [...quote.additional_terms];
    updatedTerms.splice(index, 1);
    setQuote({
      ...quote,
      additional_terms: updatedTerms
    });
  };

  const getProjectTypeLabel = (type: string) => {
    const types = {
      web: 'Web Application',
      mobile: 'Mobile Application',
      desktop: 'Desktop Software',
      other: 'Other'
    };
    return types[type as keyof typeof types] || type;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to save quotes');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const quoteData = {
        project_name: quote.project_name,
        project_description: quote.project_description,
        project_type: quote.project_type,
        base_price: quote.base_price,
        total_price: calculateTotal(),
        time_value: quote.time_value,
        time_unit: quote.time_unit,
        time_range: getTimeRange(),
        client_name: quote.client_name,
        client_company: quote.client_company,
        client_email: quote.client_email,
        user_id: user.id
      };

      const { data: savedQuote, error: quoteError } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select()
        .single();

      if (quoteError) throw quoteError;

      if (!savedQuote) {
        throw new Error('No data returned after saving quote');
      }

      if (quote.features.length > 0) {
        const featureData = quote.features.map(feature => ({
          quote_id: savedQuote.id,
          name: feature.name,
          price: feature.price,
          is_custom: feature.is_custom,
          pricing_type: feature.pricing_type,
          royalty_percentage: feature.royalty_percentage,
          royalty_timeframe: feature.royalty_timeframe,
          royalty_timeframe_unit: feature.royalty_timeframe_unit,
          royalty_threshold: feature.royalty_threshold,
          royalty_buyout_amount: feature.royalty_buyout_amount,
          hourly_rate: feature.hourly_rate,
          weekly_cap_hours: feature.weekly_cap_hours,
          monthly_cap_hours: feature.monthly_cap_hours,
          max_cap_hours: feature.max_cap_hours,
          monthly_hours_used: feature.monthly_hours_used,
          last_reset_date: feature.last_reset_date
        }));

        const { error: featuresError } = await supabase
          .from('quote_features')
          .insert(featureData);

        if (featuresError) throw featuresError;
      }

      navigate(`/quotes/${savedQuote.id}`);
    } catch (error: any) {
      console.error('Error in quote submission:', error);
      setError(error.message || 'Error saving quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generate Quote</h1>
        <PreviewToggle
          showPreview={showPreview}
          previewType={previewType}
          onTogglePreview={() => setShowPreview(!showPreview)}
          onChangePreviewType={setPreviewType}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {error && (
            <div className={`${error.includes('successfully') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} px-4 py-3 rounded relative border`}>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProjectDetailsForm
              projectName={quote.project_name}
              projectDescription={quote.project_description}
              projectType={quote.project_type}
              basePrice={quote.base_price}
              timeValue={quote.time_value}
              timeUnit={quote.time_unit}
              onChange={handleFieldChange}
            />

            <ClientDetailsForm
              clientName={quote.client_name}
              clientCompany={quote.client_company}
              clientEmail={quote.client_email}
              onChange={handleFieldChange}
            />

            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Additional Features</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-omni-600 hover:bg-omni-700"
                >
                  Add Feature
                </button>
              </div>
              <div className="space-y-6">
                {quote.features.map((feature, index) => (
                  <div key={feature.id} className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder="Feature name"
                        value={feature.name}
                        onChange={(e) => updateFeature(index, 'name', e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handlePricingTypeChange(index, 'fixed')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            feature.pricing_type === 'fixed'
                              ? 'bg-omni-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Fixed Price
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePricingTypeChange(index, 'royalty')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            feature.pricing_type === 'royalty'
                              ? 'bg-omni-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Royalty
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePricingTypeChange(index, 'hourly')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            feature.pricing_type === 'hourly'
                              ? 'bg-omni-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Hourly
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>

                    {feature.pricing_type === 'fixed' && (
                      <div className="ml-0">
                        <label className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={feature.price}
                          onChange={(e) => updateFeature(index, 'price', parseInt(e.target.value))}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
                        />
                      </div>
                    )}

                    {feature.pricing_type === 'royalty' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Royalty Percentage
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={feature.royalty_percentage || ''}
                                onChange={(e) => updateFeature(index, 'royalty_percentage', parseFloat(e.target.value) || undefined)}
                                className="block w-full rounded-md border-gray-300 focus:border-omni-500 focus:ring-omni-500"
                                placeholder="5.0"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">%</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Duration Unit
                            </label>
                            <select
                              value={feature.royalty_timeframe_unit || 'months'}
                              onChange={(e) => handleRoyaltyUnitChange(index, e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
                            >
                              <option value="months">Months</option>
                              <option value="years">Years</option>
                              <option value="perpetual">Perpetual</option>
                            </select>
                          </div>

                          {feature.royalty_timeframe_unit !== 'perpetual' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Duration
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={feature.royalty_timeframe || ''}
                                onChange={(e) => updateFeature(index, 'royalty_timeframe', parseInt(e.target.value) || undefined)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
                                placeholder={feature.royalty_timeframe_unit === 'months' ? '12' : '1'}
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Royalty Threshold
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={feature.royalty_threshold || ''}
                                onChange={(e) => updateFeature(index, 'royalty_threshold', parseInt(e.target.value) || undefined)}
                                className="block w-full pl-7 rounded-md border-gray-300 focus:border-omni-500 focus:ring-omni-500"
                                placeholder="200000"
                              />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Maximum amount of royalties to be paid
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Early Buyout Amount
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={feature.royalty_buyout_amount || ''}
                                onChange={(e) => updateFeature(index, 'royalty_buyout_amount', parseInt(e.target.value) || undefined)}
                                className="block w-full pl-7 rounded-md border-gray-300 focus:border-omni-500 focus:ring-omni-500"
                                placeholder="160000"
                              />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Optional early termination fee
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {feature.pricing_type === 'hourly' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Hourly Rate
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={feature.hourly_rate || ''}
                                onChange={(e) => updateFeature(index, 'hourly_rate', parseInt(e.target.value) || undefined)}
                                className="block w-full pl-7 rounded-md border-gray-300 focus:border-omni-500 focus:ring-omni-500"
                                placeholder="150"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Weekly Cap (Hours)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={feature.weekly_cap_hours || ''}
                              onChange={(e) => updateFeature(index, 'weekly_cap_hours', parseInt(e.target.value) || undefined)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
                              placeholder="10"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Resets weekly
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Monthly Cap (Hours)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={feature.monthly_cap_hours || ''}
                              onChange={(e) => updateFeature(index, 'monthly_cap_hours', parseInt(e.target.value) || undefined)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
                              placeholder="40"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Resets monthly
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Max Cap (Hours)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={feature.max_cap_hours || ''}
                              onChange={(e) => updateFeature(index, 'max_cap_hours', parseInt(e.target.value) || undefined)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
                              placeholder="0"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              0 for no limit
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <AdditionalTermsForm
              terms={quote.additional_terms || []}
              newTerm={newTerm}
              onNewTermChange={setNewTerm}
              onAddTerm={addTerm}
              onRemoveTerm={removeTerm}
            />

            <TotalPriceDisplay total={calculateTotal()} />

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/quotes')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-omni-600 hover:bg-omni-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Generate Quote'}
              </button>
            </div>
          </form>
        </div>

        {showPreview && (
          <div className="lg:sticky lg:top-6">
            {previewType === 'quote' ? (
              <QuotePreview
                projectName={quote.project_name}
                projectDescription={quote.project_description}
                projectType={getProjectTypeLabel(quote.project_type)}
                basePrice={quote.base_price}
                totalPrice={calculateTotal()}
                timeRange={getTimeRange()}
                clientName={quote.client_name}
                clientCompany={quote.client_company}
                clientEmail={quote.client_email}
                features={quote.features}
                additionalTerms={quote.additional_terms}
              />
            ) : (
              <ContractPreview
                projectName={quote.project_name}
                projectDescription={quote.project_description}
                projectType={getProjectTypeLabel(quote.project_type)}
                basePrice={quote.base_price}
                totalPrice={calculateTotal()}
                timeRange={getTimeRange()}
                clientName={quote.client_name}
                clientCompany={quote.client_company}
                clientEmail={quote.client_email}
                features={quote.features}
                additionalTerms={quote.additional_terms}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}