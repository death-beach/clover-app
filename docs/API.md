# API Documentation

## Overview
This document provides comprehensive documentation for all API endpoints, integrations, and interfaces used in the Clover POS App.

## API Endpoints

### Authentication API

#### Login
```typescript
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": string,
  "password": string
}

Response:
{
  "token": string,
  "user": {
    "id": string,
    "role": UserRole,
    "permissions": RolePermissions
  }
}
```

#### Logout
```typescript
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "success": boolean
}
```

### Transaction API

#### Create Transaction
```typescript
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "amount": number,
  "currency": string,
  "description": string,
  "metadata": {
    "orderId": string,
    "customerInfo": {
      "name": string,
      "email": string
    }
  }
}

Response:
{
  "transactionId": string,
  "status": "pending" | "completed" | "failed",
  "paymentLink": string
}
```

#### Get Transaction Status
```typescript
GET /api/transactions/:id
Authorization: Bearer <token>

Response:
{
  "transactionId": string,
  "status": "pending" | "completed" | "failed",
  "amount": number,
  "currency": string,
  "timestamp": string,
  "metadata": object
}
```

### User Management API

#### Create User
```typescript
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "email": string,
  "role": UserRole,
  "name": string,
  "metadata": object
}

Response:
{
  "userId": string,
  "email": string,
  "role": UserRole,
  "status": "active" | "pending"
}
```

#### Update User Role
```typescript
PUT /api/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "role": UserRole
}

Response:
{
  "userId": string,
  "role": UserRole,
  "updated": boolean
}
```

## Helius Integration

### Transaction Monitoring

#### Webhook Configuration
```typescript
POST /api/webhook/helius
Content-Type: application/json

Request:
{
  "accountAddresses": string[],
  "transactionTypes": string[],
  "webhookURL": string
}

Response:
{
  "webhookId": string,
  "status": "active"
}
```

#### Transaction Enrichment
```typescript
GET /api/helius/transaction/:signature
Authorization: Bearer <token>

Response:
{
  "signature": string,
  "type": string,
  "timestamp": number,
  "fee": number,
  "nativeTransfers": Array<{
    "fromUserAccount": string,
    "toUserAccount": string,
    "amount": number
  }>,
  "tokenTransfers": Array<{
    "fromUserAccount": string,
    "toUserAccount": string,
    "tokenAmount": number,
    "mint": string
  }>
}
```

## Helio Integration

### Off-Ramp Processing

#### Initiate Off-Ramp
```typescript
POST /api/helio/offramp
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "amount": number,
  "currency": string,
  "destinationBank": string,
  "accountNumber": string,
  "accountName": string
}

Response:
{
  "offRampId": string,
  "status": "pending",
  "estimatedCompletion": string
}
```

#### Check Off-Ramp Status
```typescript
GET /api/helio/offramp/:id
Authorization: Bearer <token>

Response:
{
  "offRampId": string,
  "status": "pending" | "completed" | "failed",
  "amount": number,
  "currency": string,
  "timestamp": string
}
```

## Error Handling

### Error Response Format
```typescript
{
  "error": {
    "code": string,
    "message": string,
    "details": object,
    "timestamp": string
  }
}
```

### Common Error Codes
- `AUTH_001`: Authentication Failed
- `AUTH_002`: Invalid Token
- `AUTH_003`: Insufficient Permissions
- `TXN_001`: Transaction Creation Failed
- `TXN_002`: Invalid Transaction Amount
- `USR_001`: User Creation Failed
- `USR_002`: Invalid Role Assignment

## Rate Limiting

### Limits
- Authentication API: 5 requests per minute
- Transaction API: 60 requests per minute
- User Management API: 30 requests per minute

### Rate Limit Response
```typescript
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "resetTime": string
  }
}
```

## WebSocket API

### Transaction Updates
```typescript
// Connect to WebSocket
ws://api/websocket?token=<auth_token>

// Message Format
{
  "type": "transaction_update",
  "data": {
    "transactionId": string,
    "status": string,
    "timestamp": string
  }
}
```

### Connection Management
- Ping every 30 seconds
- Automatic reconnection with exponential backoff
- Maximum 3 reconnection attempts

## API Versioning

### Version Headers
```
Accept: application/json; version=1.0
```

### Version Support
- v1.0: Current stable version
- v0.9: Legacy support (deprecated)
- v1.1: Beta features (optional)

## Security

### Authentication
- JWT-based authentication
- Token expiration: 24 hours
- Refresh token mechanism
- Role-based access control

### API Keys
- Helius API key required
- Helio API key required
- Rate limiting per API key
- Key rotation policy

## Testing

### Endpoints
```
# Development
https://api-dev.example.com

# Staging
https://api-staging.example.com

# Production
https://api.example.com
```

### Test Accounts
```json
{
  "admin": {
    "email": "admin@test.com",
    "role": "ADMIN"
  },
  "manager": {
    "email": "manager@test.com",
    "role": "MANAGER"
  },
  "cashier": {
    "email": "cashier@test.com",
    "role": "CASHIER"
  }
}
```

## SDK Integration

### JavaScript/TypeScript
```typescript
import { CloverPOSClient } from '@clover-pos/sdk';

const client = new CloverPOSClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Create transaction
const transaction = await client.createTransaction({
  amount: 100,
  currency: 'USD'
});
```

### Python
```python
from clover_pos import CloverPOSClient

client = CloverPOSClient(
    api_key='your-api-key',
    environment='production'
)

# Create transaction
transaction = client.create_transaction(
    amount=100,
    currency='USD'
)
```

## Webhook Integration

### Webhook Format
```typescript
{
  "event": string,
  "timestamp": string,
  "data": {
    "type": string,
    "id": string,
    "attributes": object
  }
}
```

### Webhook Events
- `transaction.created`
- `transaction.completed`
- `transaction.failed`
- `offramp.initiated`
- `offramp.completed`

### Webhook Security
- HMAC signature validation
- IP whitelist
- Retry mechanism
- Event idempotency

## Migration Guides

### v0.9 to v1.0
- Updated authentication mechanism
- New transaction response format
- Additional user management endpoints
- Deprecated legacy endpoints

### v1.0 to v1.1
- WebSocket support
- Enhanced error responses
- Rate limiting improvements
- New beta features

## Support

### Contact Information
- Technical Support: support@example.com
- API Status: status.example.com
- Documentation: docs.example.com

### Issue Reporting
- GitHub Issues: github.com/example/issues
- Bug Reports: bugs.example.com
- Feature Requests: feedback.example.com