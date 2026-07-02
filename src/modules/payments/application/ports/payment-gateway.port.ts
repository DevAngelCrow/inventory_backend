export interface ProcessPaymentParams {
  amount: number;
  currency: string;
  paymentMethodCode: string; // e.g., 'CASH', 'CARD', 'TRANSFER'
  referenceNumber?: string;
}

export interface ProcessPaymentResult {
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  gatewayProvider: string;
  gatewayTxId?: string;
  gatewayResponse?: any;
}

export abstract class PaymentGatewayPort {
  abstract process(params: ProcessPaymentParams): Promise<ProcessPaymentResult>;
}
