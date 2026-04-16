import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

// Payment method storage requires a payment gateway integration (e.g. Stripe).
// Saved cards are managed by the payment provider — never stored on our servers.
// This page shows the user where to manage their payment methods once a gateway is integrated.

export default function PaymentMethods() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Payment Methods</h3>

      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
        <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="font-semibold text-gray-700 mb-2">No saved payment methods</p>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Payment methods are managed securely at checkout. Your card details are never stored on our servers.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>All transactions are encrypted and processed securely. We never store your full card number.</p>
      </div>
    </div>
  );
}
