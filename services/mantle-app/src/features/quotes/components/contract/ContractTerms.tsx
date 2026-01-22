import React from 'react';

interface ContractTermsProps {
  getHighestBuyoutAmount: () => number;
  hasRoyaltyFeatures: () => boolean;
  hasHourlyFeatures: () => boolean;
  additionalTerms?: string[];
  timeRange: string;
}

export default function ContractTerms({
  getHighestBuyoutAmount,
  hasRoyaltyFeatures,
  hasHourlyFeatures,
  additionalTerms = [],
  timeRange
}: ContractTermsProps) {
  return (
    <>
      <section>
        <h2 className="text-lg font-bold mb-2">3. Timeline</h2>
        <p>
          The estimated delivery for project completion is {timeRange} from the date this agreement is signed into effect.
          This is a rough estimate based on the project scope and requirements outlined in this contract.
          The final timeline may vary as the project develops and requirements are refined. Delays caused by the Client (e.g. failure to provide feedback, additional feature requests) 
          may extend the timeline. Developer shall not be held responsible if the project timeline exceeds this estimate.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">4. Ownership & Licensing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Upon full payment, Client receives a non-exclusive, perpetual license to use the developed software.</li>
          <li>Developer retains the right to reuse generic, reusable components (e.g. libraries, utilities, user interface elements) in future projects. This license excludes Client-specific business logic, proprietary algorithms, or branding elements.</li>
          <li>If Client sells, transfers, or rebrands the software, this license remains in effect unless a separate transfer agreement is negotiated.</li>
          <li>Client may not sublicense, sell, or redistribute the software as a standalone product without a separate resale agreement.</li>
          <li>If Client sells or transfers their business as a whole, including its assets and operations, the software license may be transferred to the new owner, provided that Client **notifies Developer in writing within thirty (30) days of the transfer. All outstanding invoices related to the software must be paid in full before the license transfer is recognized. Upon transfer, the new owner assumes all rights, obligations, and responsibilities under this license, including compliance with all terms of this Agreement.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">5. Portfolio & Marketing Rights</h2>
        <p>
          Developer reserves the right to publicly showcase the project (e.g. descriptions, screenshots, case studies, advertisements) unless Client requests confidentiality. Developer may also reference the Client's name and testimonials in a portfolio or client list unless Client submits a written request for exclusion. If confidentiality is required, Client must submit a written request, and a separate NDA agreement may be negotiated. If the Client requests confidentiality after public showcasing, Developer is not required to remove any existing references but will honor non-disclosure for future materials. Developer is under no obligation to remove or modify past references unless both parties agree in writing.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">6. Confidentiality</h2>
        <p className="space-y-2">
          Both parties agree to maintain the confidentiality of any proprietary or sensitive information disclosed during the course of the project.
          Developer retains the right to reuse general development methodologies, non-client-specific components, and technical solutions in future projects.
          Client shall not disclose Developer's internal processes, methodologies, or proprietary development techniques to third parties without written consent.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">7. Maintenance & Support</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>30 days of free post-launch bug fixes and security patches are included as a courtesy.</li>
          {hasRoyaltyFeatures() && (
            <li>
              While the royalty agreement is active, up to 10 hours per month of maintenance 
              is included for bug fixes and minor updates.
              {getHighestBuyoutAmount() > 0 && (
                <span>
                  {" "}If the client exercises the buyout option on a royalty, 
                  all future maintenance and updates will be billed at Omni LLC's standard hourly rate.
                </span>
              )}
            </li>
          )}
          <li>Additional maintenance, new features, or integrations require a separate agreement.</li>
          {hasHourlyFeatures() && (
            <li>
              Hourly maintenance services are billed at the rates specified in the feature breakdown, 
              subject to the agreed-upon weekly and monthly caps.
            </li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">8. Change Requests & Scope Creep</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Any modifications outside the original scope require a written request and separate cost estimate. Work will not begin on additional features until Client approves the updated estimate.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">9. External Provider Costs</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Client is responsible for all third-party platform costs (e.g. web hosting, API fees, domain registration), and Developer shall not be responsible for the hosting, uptime, security, or maintenance of any external infrastructure once delivered. Developer will assist in setting up these services but is not liable for third-party service failures or disruptions.</li>
          <li>Developer is not responsible for changes in third-party API pricing, availability, or terms. Any additional work required due to third-party service modifications will be billed separately.</li>
          <li>If third-party platform failures or API changes require modifications to the software, such work is considered out-of-scope and will be billed separately at Developer's standard hourly rate. Developer is not obligated to provide fixes or modifications unless a separate agreement is reached.</li>
        </ul>
      </section>

      {additionalTerms.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-2">15. Additional Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            {additionalTerms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}