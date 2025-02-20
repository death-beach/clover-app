# Authentication Flow

The Clover USDC Payment Gateway implements a two-phase authentication system that combines Privy wallet authentication for initial setup with Clover OAuth for ongoing operations.

## Phase 1: Initial Setup (Privy Auth)

### Purpose
- Enable merchant owners to complete initial system setup
- Secure wallet connection for cryptocurrency operations
- Configure essential merchant settings

### Flow
1. **Wallet Connection**
   - Merchant owner visits setup page
   - Connects wallet using Privy interface
   - System validates wallet ownership

2. **Initial Access**
   - Temporary full system access granted
   - Access limited to setup-specific functions
   - 24-hour setup window provided

3. **Configuration Tasks**
   - Set up merchant wallets
   - Configure Clover integration
   - Complete initial settings

## Phase 2: Operational Authentication (Clover OAuth)

### Purpose
- Integrate with existing Clover POS permissions
- Provide seamless access for all staff members
- Maintain security standards

### Flow
1. **Clover OAuth Login**
   ```
   GET /api/auth/clover
   → Redirect to Clover OAuth
   → Callback with authorization code
   → Exchange for access token
   → Create session
   ```

2. **Required Permissions**
   - READ_MERCHANT
   - WRITE_ORDERS
   - READ_ORDERS

3. **Session Management**
   - JWT tokens issued
   - 8-hour session duration
   - Automatic refresh mechanism

### Security Measures
- HTTPS required for all auth endpoints
- Rate limiting on auth attempts
- Session invalidation on role changes
- Secure cookie storage
- CSRF protection enabled

## Implementation Details

### Environment Variables
```
PRIVY_APP_ID=xxx
CLOVER_CLIENT_ID=xxx
CLOVER_CLIENT_SECRET=xxx
NEXTAUTH_SECRET=xxx
```

### API Endpoints
```
POST /api/auth/privy/setup
GET  /api/auth/clover
POST /api/auth/clover/callback
POST /api/auth/logout
```

### Error Handling
- Invalid credentials: 401 Unauthorized
- Missing permissions: 403 Forbidden
- Rate limit exceeded: 429 Too Many Requests
- Server errors: 500 Internal Server Error

## Session Validation

### Request Flow
1. Incoming request
2. Validate session token
3. Check role permissions
4. Process request
5. Update session if needed

### Session Properties
```typescript
interface Session {
  userId: string;
  merchantId: string;
  role: UserRole;
  cloverEmployeeId: string;
  exp: number;
}
```

## Security Best Practices

1. **Token Security**
   - Short-lived access tokens
   - Secure token storage
   - Regular token rotation

2. **Access Control**
   - Role-based permissions
   - Resource-level checks
   - Audit logging

3. **Infrastructure**
   - TLS 1.3 required
   - Secure headers
   - DDoS protection

## Troubleshooting

### Common Issues
1. **Invalid Clover Credentials**
   - Verify Clover API credentials
   - Check permission scopes
   - Validate merchant account status

2. **Session Expiration**
   - Check token expiration
   - Verify refresh token validity
   - Confirm clock synchronization

3. **Permission Denied**
   - Validate user role
   - Check required permissions
   - Verify merchant status

### Support Process
1. Check error logs
2. Verify configuration
3. Validate credentials
4. Contact support if needed