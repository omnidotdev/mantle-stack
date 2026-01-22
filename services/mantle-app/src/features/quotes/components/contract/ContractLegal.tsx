import React from 'react';

export default function ContractLegal() {
  return (
    <>
      <section>
        <h2 className="text-lg font-bold mb-2">10. Limitation of Liability</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Developer's total liability shall not exceed the total amount paid under this agreement.</li>
          <li>Developer is not responsible for indirect, consequential, or incidental damages, including but not limited to loss of revenue, data breaches, or downtime due to third-party services.</li>
          <li>Client agrees to indemnify Developer against claims arising from Client's use of the software, except in cases of Developer's proven gross negligence.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">11. Compliance Disclaimer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Developer will assist in integrating necessary compliance features but is not responsible for ensuring compliance with financial, tax, or data protection regulations (e.g. PCI, GDPR, HIPAA).</li>
          <li>The Client is responsible for obtaining necessary legal counsel and compliance approvals for the software and its attached external platforms and resources.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">12. Termination & Refund Policy</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Either party may terminate this agreement with 14 days' written notice. If Client cancels before work begins, they shall pay a non-refundable reservation fee of $1,000 within three (3) business days of cancellation notice.</li>
          <li>If Client cancels the project, all completed work must be paid in full, and any work-in-progress will be billed on a pro-rata basis. Payment for such work shall be due within seven (7) days of the cancellation date.</li>
          <li>No refunds will be issued for completed work.</li>
          <li>Developer shall not be required to deliver unfinished work or incomplete code unless otherwise agreed upon.</li>
          <li>If Client terminates the agreement before project completion, a termination fee equal to 20% of the remaining contract value or $1,000, whichever is greater, will be due immediately and paid within three (3) business days of the date of termination.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">13. Governing Law & Dispute Resolution</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>This Agreement shall be governed by the laws of Minnesota.</li>
          <li>All disputes arising from or related to this Agreement shall be resolved exclusively through binding arbitration in Minnesota. Litigation may only be pursued if arbitration fails to provide a resolution, and any such litigation shall be filed exclusively in the state or federal courts located in Minnesota.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">14. Miscellaneous</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>This Agreement supersedes all prior discussions related to the Project.</li>
          <li>Any amendments to this Agreement must be in writing and signed by both parties.</li>
        </ul>
      </section>
    </>
  );
}