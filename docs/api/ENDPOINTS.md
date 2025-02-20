# API Endpoints

## Payment Processing

### Create Payment Request
```http
POST /api/payments/create
```

Request:
```json
{
  "orderId": "ORD_123456",
  "amount": 99.99,
  "currency": "USDC",
  "merchantId": "MERCH_123",
  "metadata": {
    "cloverOrderId": "CLOV_123",
    "customerReference": "CUST_456"
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "paymentId": "PAY_789",
    "qrCode": "https://qr.example.com/PAY_789",
    "expiresAt": "2024-01-01T12:00:00Z",
    "amount": 99.99,
    "status": "PENDING"
  }
}
```

### Get Payment Status
```http
GET /api/payments/:paymentId
```

Response:
```json
{
  "success": true,
  "data": {
    "paymentId": "PAY_789",
    "status": "COMPLETED",
    "transaction": {
      "signature": "5KL...xyz",
      "confirmations": 32,
      "timestamp": "2024-01-01T12:05:00Z"
    }
  }
}
```

## Transaction Management

### List Transactions
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
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN_123",
        "amount": 99.99,
        "status": "COMPLETED",
        "signature": "5KL...xyz",
        "timestamp": "2024-01-01T12:05:00Z",
        "cloverOrderId": "CLOV_123"
      }
    ],
    "total": 50,
    "limit": 20,
    "offset": 0
  }
}
```

### Get Transaction Details
```http
GET /api/transactions/:transactionId
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "TXN_123",
    "merchantId": "MERCH_123",
    "cloverOrderId": "CLOV_123",
    "amount": 99.99,
    "status": "COMPLETED",
    "signature": "5KL...xyz",
    "confirmations": 32,
    "timestamp": "2024-01-01T12:05:00Z",
    "metadata": {
      "customerReference": "CUST_456"
    }
  }
}
```

## Merchant Operations

### Get Merchant Settings
```http
GET /api/merchants/settings
```

Response:
```json
{
  "success": true,
  "data": {
    "merchantId": "MERCH_123",
    "businessName": "Example Store",
    "mainWalletAddress": "sol...xyz",
    "offrampWalletAddress": "sol...abc",
    "kycStatus": "APPROVED",
    "autoSettlement": true,
    "settlementSchedule": {
      "frequency": "DAILY",
      "time": "23:00:00",
      "minimumAmount": 100
    }
  }
}
```

### Update Merchant Settings
```http
PATCH /api/merchants/settings
```

Request:
```json
{
  "autoSettlement": true,
  "settlementSchedule": {
    "frequency": "DAILY",
    "time": "23:00:00",
    "minimumAmount": 100
  }
}
```

## Off-ramp Operations

### Initiate Transfer
```http
POST /api/transfers/initiate
```

Request:
```json
{
  "amount": 1000,
  "fromWallet": "sol...xyz",
  "toWallet": "sol...abc"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "transferId": "TRANSFER_123",
    "status": "PENDING",
    "estimatedCompletionTime": "2024-01-01T13:00:00Z"
  }
}
```

### Get Transfer Status
```http
GET /api/transfers/:transferId
```

Response:
```json
{
  "success": true,
  "data": {
    "transferId": "TRANSFER_123",
    "status": "COMPLETED",
    "amount": 1000,
    "fromWallet": "sol...xyz",
    "toWallet": "sol...abc",
    "timestamp": "2024-01-01T12:00:00Z",
    "completionTime": "2024-01-01T12:05:00Z"
  }
}
```

## User Management

### List Users
```http
GET /api/users
```

Response:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "userId": "USER_123",
        "merchantId": "MERCH_123",
        "role": "ADMIN",
        "cloverEmployeeId": "CLOV_EMP_123",
        "email": "admin@example.com"
      }
    ],
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

### Get User Details
```http
GET /api/users/:userId
```

Response:
```json
{
  "success": true,
  "data": {
    "userId": "USER_123",
    "merchantId": "MERCH_123",
    "role": "ADMIN",
    "cloverEmployeeId": "CLOV_EMP_123",
    "email": "admin@example.com",
    "permissions": [
      "MANAGE_USERS",
      "VIEW_TRANSACTIONS",
      "PROCESS_PAYMENTS"
    ]
  }
}
```