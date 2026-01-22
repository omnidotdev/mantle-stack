import React from 'react';
import { Feature } from '../../types/contract';

interface ContractScopeProps {
  projectName: string;
  projectType: string;
  projectDescription: string;
}

export default function ContractScope({
  projectName,
  projectType,
  projectDescription
}: ContractScopeProps) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-2">1. Scope of Work</h2>
      <p>
        Developer agrees to develop the software product known as "{projectName}" 
        (the "Project"), a {projectType.toLowerCase()}. The Project involves the following high-level details, 
        with granular item and pricing details outlined in Section 2:
      </p>
      <div className="pl-6 mt-2 space-y-2">
        <p>{projectDescription}</p>
      </div>
      
      <p className="mt-4">
        Any modifications, enhancements, or additional features beyond the original scope 
        will require a separate written agreement and may be subject to additional fees.
      </p>
    </section>
  );
}