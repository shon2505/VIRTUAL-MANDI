/**
 * B2B Agricultural Payment & Escrow Service Stub
 * Supports:
 * - ONDC Smart Escrow
 * - Corporate NEFT / RTGS Wire Transfer
 * - B2B Quality-Inspection-Linked Pay-On-Delivery
 */

export interface PaymentIntent {
  orderId: string;
  amount: number;
  currency: 'INR';
  method: 'ondc_escrow' | 'rtgs_neft' | 'pay_on_delivery_inspection';
  buyerGstin: string;
  farmerBankRef: string;
}

export const paymentService = {
  async initiateEscrowHold(intent: PaymentIntent) {
    console.log('[Payment Gateway] Locking funds in Mandi Escrow:', intent);
    return {
      success: true,
      escrowReference: `ESCROW_VM_${Date.now()}`,
      status: 'HELD_IN_ESCROW',
      amountHeld: intent.amount,
      payoutTrigger: 'WAREHOUSE_QUALITY_ACCEPTANCE',
    };
  },

  async releaseFarmerPayout(escrowRef: string, farmerAccount: string) {
    console.log('[Payment Gateway] Releasing escrow to farmer account:', escrowRef, farmerAccount);
    return {
      success: true,
      utrNumber: `UTR-SBIN${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'TRANSFERRED',
      transferredAt: new Date().toISOString(),
    };
  },
};
