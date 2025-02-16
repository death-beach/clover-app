import { helioApi } from '../config/sdk';

export interface HelioPaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentLink: string;
}

export async function createPaymentIntent(amount: number, currency: string = 'USD') {
  try {
    const response = await helioApi.post('/payment-intents', {
      amount,
      currency,
      // Add any additional parameters required by Helio
    });

    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function getPaymentStatus(paymentIntentId: string) {
  try {
    const response = await helioApi.get(`/payment-intents/${paymentIntentId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
}

export async function initiateOffRamp(amount: number, currency: string = 'USD') {
  try {
    const response = await helioApi.post('/off-ramp', {
      amount,
      currency,
      // Add any additional parameters required by Helio
    });

    return response.data;
  } catch (error) {
    console.error('Error initiating off-ramp:', error);
    throw error;
  }
}