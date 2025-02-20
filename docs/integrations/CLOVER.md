# Clover Integration Guide

## Overview

The Clover integration enables:
- OAuth-based authentication
- Order synchronization
- Custom payment tender
- Employee role mapping
- Real-time order updates

## Prerequisites

1. Clover Developer Account
2. Merchant ID
3. OAuth Credentials
   - Client ID
   - Client Secret
4. Required API Permissions:
   - READ_MERCHANT
   - WRITE_ORDERS
   - READ_ORDERS

## Setup Process

### 1. Clover App Configuration

1. Create App in Clover Developer Dashboard
   ```
   App Name: USDC Payments
   App Type: Web
   ```

2. Configure OAuth Settings
   ```
   Redirect URI: https://your-domain.com/api/auth/clover/callback
   Permissions: READ_MERCHANT, WRITE_ORDERS, READ_ORDERS
   ```

3. Get API Credentials
   ```
   Client ID: {YOUR_CLIENT_ID}
   Client Secret: {YOUR_CLIENT_SECRET}
   ```

### 2. Custom Tender Setup

1. Create Custom Tender Type
   ```json
   {
     "label": "USDC",
     "labelKey": "tender.usdc",
     "enabled": true,
     "opensCashDrawer": false,
     "allowsRefunds": true,
     "allowsTipping": true
   }
   ```

2. Configure Tender Mapping
   ```typescript
   const TENDER_MAPPING = {
     id: 'USDC_TENDER',
     label: 'USDC Payment',
     currency: 'USDC'
   };
   ```

## Core Integration Points

### 1. Authentication Flow

```typescript
// Initialize Clover Client
const clover = new CloverClient({
  clientId: process.env.CLOVER_CLIENT_ID,
  clientSecret: process.env.CLOVER_CLIENT_SECRET,
  merchantId: process.env.CLOVER_MERCHANT_ID
});

// OAuth Flow
async function handleCloverAuth(code: string) {
  const tokens = await clover.exchangeCode(code);
  await storeTokens(tokens);
  await setupMerchant(tokens.merchantId);
}
```

### 2. Order Management

```typescript
// Create Order
async function createOrder(orderData: OrderData) {
  const order = await clover.orders.create({
    total: orderData.amount,
    currency: 'USD',
    tender: TENDER_MAPPING.id,
    externalId: orderData.paymentId
  });
  
  return order;
}

// Update Order Status
async function updateOrderStatus(orderId: string, status: string) {
  await clover.orders.update(orderId, {
    status: status,
    tender: TENDER_MAPPING.id
  });
}
```

### 3. Employee Role Mapping

```typescript
// Role Mapping Configuration
const ROLE_MAPPING = {
  'OWNER': 'owner',
  'ADMIN': 'admin',
  'MANAGER': 'manager',
  'EMPLOYEE': 'employee'
};

// Fetch Employee Role
async function getEmployeeRole(employeeId: string) {
  const employee = await clover.employees.get(employeeId);
  return ROLE_MAPPING[employee.role] || 'employee';
}
```

## Webhook Integration

### 1. Order Webhooks

```typescript
// Register Webhook
await clover.webhooks.create({
  url: 'https://your-domain.com/api/webhooks/clover',
  events: ['order.created', 'order.updated']
});

// Handle Webhook
async function handleCloverWebhook(event: CloverWebhookEvent) {
  switch (event.type) {
    case 'order.created':
      await handleOrderCreated(event.data);
      break;
    case 'order.updated':
      await handleOrderUpdated(event.data);
      break;
  }
}
```

### 2. Employee Webhooks

```typescript
// Register Employee Webhook
await clover.webhooks.create({
  url: 'https://your-domain.com/api/webhooks/clover/employees',
  events: ['employee.created', 'employee.updated', 'employee.deleted']
});

// Handle Employee Updates
async function handleEmployeeWebhook(event: CloverWebhookEvent) {
  switch (event.type) {
    case 'employee.created':
    case 'employee.updated':
      await syncEmployeeRole(event.data);
      break;
    case 'employee.deleted':
      await deactivateEmployee(event.data);
      break;
  }
}
```

## Error Handling

### 1. Common Errors

```typescript
try {
  await clover.orders.create(orderData);
} catch (error) {
  if (error.code === 'INVALID_ACCESS_TOKEN') {
    await refreshTokens();
    // Retry operation
  } else if (error.code === 'MERCHANT_INACTIVE') {
    await notifySupport('Merchant account inactive');
  }
  throw error;
}
```

### 2. Token Refresh

```typescript
async function refreshCloverTokens() {
  const tokens = await clover.refreshAccessToken(refreshToken);
  await storeTokens(tokens);
  return tokens;
}
```

## Testing

### 1. Test Environment

```typescript
const testClover = new CloverClient({
  clientId: process.env.CLOVER_TEST_CLIENT_ID,
  clientSecret: process.env.CLOVER_TEST_CLIENT_SECRET,
  environment: 'sandbox'
});
```

### 2. Test Cases

```typescript
// Test Order Creation
async function testOrderFlow() {
  // Create test order
  const order = await testClover.orders.create({
    total: 1000,
    currency: 'USD'
  });
  
  // Update order status
  await testClover.orders.update(order.id, {
    status: 'paid'
  });
  
  // Verify order status
  const updatedOrder = await testClover.orders.get(order.id);
  assert(updatedOrder.status === 'paid');
}
```

## Monitoring

### 1. Health Checks

```typescript
async function checkCloverHealth() {
  try {
    await clover.merchant.get();
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error };
  }
}
```

### 2. Metrics

```typescript
// Track API Usage
const metrics = {
  orderCreated: new Counter('clover_orders_created'),
  orderUpdated: new Counter('clover_orders_updated'),
  apiErrors: new Counter('clover_api_errors')
};
```

## Security Considerations

1. **Token Storage**
   - Store tokens securely
   - Encrypt sensitive data
   - Regular token rotation

2. **Webhook Security**
   - Validate webhook signatures
   - Use HTTPS endpoints
   - Implement rate limiting

3. **Access Control**
   - Validate permissions
   - Audit access logs
   - Monitor suspicious activity

## Troubleshooting Guide

### Common Issues

1. **Authentication Failed**
   - Check OAuth credentials
   - Verify redirect URI
   - Validate token expiration

2. **Order Updates Failed**
   - Check API permissions
   - Verify merchant status
   - Validate order data

3. **Webhook Issues**
   - Check webhook URL
   - Verify SSL certificate
   - Monitor webhook logs

### Support Resources

1. Clover Developer Dashboard
2. API Documentation
3. Support Contact
4. Status Page