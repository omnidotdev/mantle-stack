import React from 'react';

interface PreviewToggleProps {
  showPreview: boolean;
  previewType: 'quote' | 'contract';
  onTogglePreview: () => void;
  onChangePreviewType: (type: 'quote' | 'contract') => void;
}

export default function PreviewToggle({
  showPreview,
  previewType,
  onTogglePreview,
  onChangePreviewType,
}: PreviewToggleProps) {
  return (
    <div className="flex items-center gap-4">
      {showPreview && (
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => onChangePreviewType('quote')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
              previewType === 'quote'
                ? 'bg-omni-600 text-white border-omni-600'
                : 'bg-white text-omni-600 border-omni-600 hover:bg-omni-50'
            }`}
          >
            Quote
          </button>
          <button
            type="button"
            onClick={() => onChangePreviewType('contract')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
              previewType === 'contract'
                ? 'bg-omni-600 text-white border-omni-600'
                : 'bg-white text-omni-600 border-omni-600 hover:bg-omni-50'
            }`}
          >
            Contract
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={onTogglePreview}
        className="px-4 py-2 text-sm font-medium text-omni-600 bg-white border border-omni-600 rounded-md hover:bg-omni-50"
      >
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </button>
    </div>
  );
}