# API Overview

## Introduction

The Clover USDC Payment Gateway API enables merchants to accept USDC payments through their Clover POS system. This API documentation provides comprehensive information about integrating and using the payment gateway.

## Authentication

All API requests require authentication using Bearer tokens:

```http
Authorization: Bearer <access_token>
```

### Obtaining Access Tokens

1. **Initial Setup (Privy Auth)**
   - Used during merchant onboarding
   - Temporary access for setup phase
   - 24-hour validity

2. **Operational Access (Clover OAuth)**
   - Standard operation authentication
   - Role-based access control
   - 8-hour token validity
   - Automatic refresh mechanism

### Token Management
```typescript
interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
}
```

## Base URLs

```typescript
// Production Environment
const PROD_API_URL = "https://api.example.com/v1";
const PROD_AUTH_URL = "https://auth.example.com/v1";

// Development Environment
const DEV_API_URL = "https://dev-api.example.com/v1";
const DEV_AUTH_URL = "https://dev-auth.example.com/v1";
```

## Common Patterns

### Request Format
- All requests should use HTTPS
- Request bodies should be JSON
- Include Content-Type header
- Include Authorization header

### Response Format

All API responses follow a standard format:

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

### Pagination

List endpoints support pagination:

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

### Filtering

Common filter parameters:
- `startDate`: ISO date string
- `endDate`: ISO date string
- `status`: Resource status
- `type`: Resource type

### Sorting

Sort parameters:
- `sortBy`: Field to sort by
- `sortOrder`: "asc" or "desc"

## Rate Limiting

- 100 requests per minute per API key
- 1000 requests per hour per merchant
- Headers included in response:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Versioning

- API version included in URL
- Current version: v1
- Breaking changes trigger version increment
- Deprecation notices provided 6 months in advance

## Security

### TLS Requirements
- TLS 1.2 or higher required
- Strong cipher suites enforced
- Certificate validation required

### API Keys
- Separate keys for development/production
- Regular rotation recommended
- Key-specific rate limits
- Activity monitoring

### CORS
- Restricted to registered domains
- Configurable per merchant
- Strict security headers

## Support

- Documentation: docs.example.com
- Support Email: api-support@example.com
- Status Page: status.example.com
- API Updates: updates.example.com