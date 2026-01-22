import React from 'react';

interface AdditionalTermsFormProps {
  terms: string[];
  newTerm: string;
  onNewTermChange: (value: string) => void;
  onAddTerm: () => void;
  onRemoveTerm: (index: number) => void;
}

export default function AdditionalTermsForm({
  terms,
  newTerm,
  onNewTermChange,
  onAddTerm,
  onRemoveTerm,
}: AdditionalTermsFormProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Additional Terms & Conditions</h2>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTerm}
            onChange={(e) => onNewTermChange(e.target.value)}
            placeholder="Enter additional term or condition"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
          />
          <button
            type="button"
            onClick={onAddTerm}
            disabled={!newTerm.trim()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-omni-600 hover:bg-omni-700 disabled:opacity-50"
          >
            Add Term
          </button>
        </div>
        
        {terms.length > 0 && (
          <ul className="space-y-2">
            {terms.map((term, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="flex-1">{term}</span>
                <button
                  type="button"
                  onClick={() => onRemoveTerm(index)}
                  className="ml-2 text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}