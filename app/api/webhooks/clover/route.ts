import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface CloverCustomer {
  id: string;
  customerSince: number;
  firstName: string;
  lastName: string;
  marketingAllowed: boolean;
  merchant: {
    id: string;
    enterprises: any[];
  };
  orders: any[];
  emailAddresses: any[];
  phoneNumbers: any[];
  addresses: any[];
  cards: any[];
  achs: any[];
}

interface WebhookEvent {
  objectId: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  ts: number;
  object?: CloverCustomer | any;
}

interface WebhookData {
  appId: string;
  merchants: {
    [merchantId: string]: WebhookEvent[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const data: WebhookData = await req.json();
    console.log('Received Clover webhook data:', JSON.stringify(data, null, 2));

    for (const [merchantId, events] of Object.entries(data.merchants)) {
      for (const event of events) {
        await handleWebhookEvent(merchantId, event);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleWebhookEvent(merchantId: string, event: WebhookEvent) {
  const { objectId, type, object, ts } = event;
  const [eventType, id] = objectId.split(':');
  const timestamp = new Date(ts).toISOString(); // Convert timestamp to readable format

  switch (eventType) {
    case 'O': // Orders
      console.log('Order event:', {
        merchantId,
        orderId: id,
        type,
        timestamp,
        hasDetails: !!object,
        ...(object && { orderDetails: object })
      });

      if (type === 'UPDATE') {
        // Add your order update processing logic here
        // For example: await processOrderUpdate(merchantId, id, object);
      }
      break;

    case 'P': // Payments
      console.log('Payment event:', {
        merchantId,
        paymentId: id,
        type,
        timestamp,
        hasDetails: !!object,
        ...(object && { paymentDetails: object })
      });

      if (object) {
        // Add your payment processing logic here
        // For example: await processPayment(merchantId, object);
      }
      break;

    case 'C': // Customers
      const customerInfo = object ? {
        customerId: object.id,
        firstName: object.firstName,
        lastName: object.lastName,
        customerSince: new Date(object.customerSince).toISOString(),
        hasEmailAddress: object.emailAddresses?.length > 0,
        hasPhoneNumber: object.phoneNumbers?.length > 0
      } : { customerId: id };

      console.log('Customer event:', {
        merchantId,
        type,
        timestamp,
        hasDetails: !!object,
        ...customerInfo
      });

      if (type === 'CREATE' && object) {
        // Add your customer creation logic here
        // For example: await createCustomerInDatabase(merchantId, object);
      }
      break;

    default:
      console.log(`Unhandled event type: ${eventType}`, {
        merchantId,
        id,
        type,
        timestamp,
        hasDetails: !!object
      });
  }
}

// Example helper functions you might want to implement:
async function processOrderUpdate(merchantId: string, orderId: string, orderData: any) {
  // Add your order processing logic here
  console.log(`Processing order update for ${orderId}`);
}

async function processPayment(merchantId: string, paymentData: any) {
  // Add your payment processing logic here
  console.log(`Processing payment for merchant ${merchantId}`);
}

async function createCustomerInDatabase(merchantId: string, customerData: CloverCustomer) {
  // Add your customer creation logic here
  console.log(`Creating customer ${customerData.id} in database`);
}