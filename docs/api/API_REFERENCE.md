# API Reference

## Overview

The Clover USDC Payment Gateway API provides endpoints for payment processing, transaction management, and merchant operations. All API endpoints are REST-based and return JSON responses.

## Base URL

```
Production: https://api.example.com
Development: https://dev-api.example.com
```

## Authentication

All API requests require authentication using Bearer tokens:

```http
Authorization: Bearer <access_token>
```

## Common Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid authentication |
| AUTH_002 | Expired token |
| PAY_001  | Invalid payment amount |
| PAY_002  | Insufficient funds |
| TXN_001  | Transaction not found |
| MER_001  | Merchant not found |

## Rate Limits

- 100 requests per minute per API key
- 1000 requests per hour per merchant
- Webhook callbacks: 10 concurrent requests

## Endpoints

### Payment Processing

#### Create Payment Request
```http
POST /api/payments/create
```

Request:
```typescript
{
  orderId: string;
  amount: number;
  currency: "USDC";
  merchantId: string;
  metadata?: {
    cloverOrderId?: string;
    customerReference?: string;
  };
}
```

Response:
```typescript
{
  success: true,
  data: {
    paymentId: string;
    qrCode: string;
    expiresAt: string;
    amount: number;
    status: "PENDING";
  }
}
```

#### Get Payment Status
```http
GET /api/payments/:paymentId
```

Response:
```typescript
{
  success: true,
  data: {
    paymentId: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    transaction?: {
      signature: string;
      confirmations: number;
      timestamp: string;
    };
  }
}
```

### Transaction Management

#### List Transactions
```http
GET /api/transactions
```

Query Parameters:
- `startDate`: ISO date string
- `endDate`: ISO date string
- `status`: Transaction status
- `limit`: Number of records (default: 20)
- `offset`: Pagination offset

Response:
```typescript
{
  success: true,
  data: {
    transactions: Array<{
      id: string;
      amount: number;
      status: string;
      signature?: string;
      timestamp: string;
      cloverOrderId?: string;
    }>;
    total: number;
    limit: number;
    offset: number;
  }
}
```

#### Get Transaction Details
```http
GET /api/transactions/:transactionId
```

Response:
```typescript
{
  success: true,
  data: {
    id: string;
    merchantId: string;
    cloverOrderId: string;
    amount: number;
    status: string;
    signature?: string;
    confirmations: number;
    timestamp: string;
    metadata: Record<string, any>;
  }
}
```

### Merchant Operations

#### Get Merchant Settings
```http
GET /api/merchants/settings
```

Response:
```typescript
{
  success: true,
  data: {
    merchantId: string;
    businessName: string;
    mainWalletAddress: string;
    offrampWalletAddress: string;
    kycStatus: string;
    autoSettlement: boolean;
    settlementSchedule?: {
      frequency: "DAILY" | "WEEKLY";
      time: string;
      minimumAmount?: number;
    };
  }
}
```

#### Update Merchant Settings
```http
PATCH /api/merchants/settings
```

Request:
```typescript
{
  autoSettlement?: boolean;
  settlementSchedule?: {
    frequency: "DAILY" | "WEEKLY";
    time: string;
    minimumAmount?: number;
  };
}
```

### Off-ramp Operations

#### Initiate Transfer
```http
POST /api/transfers/initiate
```

Request:
```typescript
{
  amount: number;
  fromWallet: string;
  toWallet: string;
}
```

Response:
```typescript
{
  success: true,
  data: {
    transferId: string;
    status: "PENDING";
    estimatedCompletionTime: string;
  }
}
```

#### Get Transfer Status
```http
GET /api/transfers/:transferId
```

Response:
```typescript
{
  success: true,
  data: {
    transferId: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    amount: number;
    fromWallet: string;
    toWallet: string;
    timestamp: string;
    completionTime?: string;
    error?: string;
  }
}
```

## Pagination

For endpoints that return lists, pagination is supported through:

```typescript
interface PaginationParams {
  limit: number;    // Default: 20, Max: 100
  offset: number;   // Default: 0
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
```

## Request Limits

- Maximum request body size: 1MB
- Maximum file upload size: 5MB
- Maximum batch operation size: 100 items