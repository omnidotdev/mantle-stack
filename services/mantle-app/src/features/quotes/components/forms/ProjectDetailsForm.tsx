import React from 'react';

interface ProjectDetailsFormProps {
  projectName: string;
  projectDescription: string;
  projectType: string;
  basePrice: number;
  timeValue: number;
  timeUnit: string;
  onChange: (field: string, value: string | number) => void;
}

export default function ProjectDetailsForm({
  projectName,
  projectDescription,
  projectType,
  basePrice,
  timeValue,
  timeUnit,
  onChange,
}: ProjectDetailsFormProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            required
            value={projectName}
            onChange={(e) => onChange('project_name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Description
          </label>
          <textarea
            required
            value={projectDescription}
            onChange={(e) => onChange('project_description', e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Type
          </label>
          <select
            value={projectType}
            onChange={(e) => onChange('project_type', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
          >
            <option value="web">Web Application</option>
            <option value="mobile">Mobile Application</option>
            <option value="desktop">Desktop Software</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Base Price
          </label>
          <input
            type="number"
            required
            min="0"
            value={basePrice}
            onChange={(e) => onChange('base_price', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time Range
          </label>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <input
              type="number"
              min="1"
              value={timeValue}
              onChange={(e) => onChange('time_value', parseInt(e.target.value))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
            />
            <select
              value={timeUnit}
              onChange={(e) => onChange('time_unit', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-omni-500 focus:ring-omni-500"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}