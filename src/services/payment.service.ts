import { Payment, PaymentStatus, PaymentType, PaymentMethod } from '@/models';
import { currentUser } from './mock.data';

export interface PaymentRequest {
  amount: number;
  currency: string;
  type: PaymentType;
  tripId?: string;
  description: string;
  method: PaymentMethod;
}

export interface PaymentResult {
  success: boolean;
  payment?: Payment;
  error?: string;
}

// Mock payment history
const paymentHistory: Payment[] = [];

export const paymentService = {
  // Process a payment
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate 95% success rate
    const isSuccessful = Math.random() > 0.05;

    if (!isSuccessful) {
      return {
        success: false,
        error: 'Payment failed. Please try again.'
      };
    }

    const payment: Payment = {
      id: 'pay_' + Date.now(),
      amount: request.amount,
      currency: request.currency,
      status: 'completed',
      type: request.type,
      tripId: request.tripId,
      payerId: currentUser.id,
      timestamp: new Date(),
      description: request.description,
      method: request.method
    };

    paymentHistory.push(payment);

    return {
      success: true,
      payment
    };
  },

  // Process NFC payment (Android)
  async processNFCPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Check if NFC is available (mock check)
    const nfcAvailable = 'NDEFReader' in window;
    
    if (!nfcAvailable) {
      // Still process but note NFC isn't available
      console.log('NFC not available, using mock payment');
    }

    // Simulate NFC tap delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return this.processPayment({ ...request, method: 'nfc' });
  },

  // Get payment history
  async getPaymentHistory(): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return paymentHistory.filter(p => p.payerId === currentUser.id);
  },

  // Get payment by ID
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return paymentHistory.find(p => p.id === paymentId) || null;
  },

  // Request refund
  async requestRefund(paymentId: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const payment = paymentHistory.find(p => p.id === paymentId);
    
    if (!payment) {
      return {
        success: false,
        error: 'Payment not found'
      };
    }

    if (payment.status === 'refunded') {
      return {
        success: false,
        error: 'Payment already refunded'
      };
    }

    payment.status = 'refunded';

    return {
      success: true,
      payment
    };
  },

  // Calculate split expense
  calculateSplit(totalAmount: number, participants: number): number {
    return Math.ceil((totalAmount / participants) * 100) / 100;
  },

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  },

  // Check if NFC is available
  isNFCAvailable(): boolean {
    return 'NDEFReader' in window;
  },

  // Initialize NFC reader (mock)
  async initializeNFC(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.isNFCAvailable();
  }
};
