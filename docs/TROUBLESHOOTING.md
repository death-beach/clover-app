# Troubleshooting Guide

This guide provides solutions for common issues encountered in the Clover USDC Payment Gateway.

## Common Issues

### Payment Processing Issues

#### 1. Payment Not Confirming

**Symptoms:**
- Payment status stuck in 'pending'
- No confirmation from Helius
- QR code scanned but no update

**Solutions:**
1. Check Solana network status
   ```bash
   solana ping -u mainnet-beta
   ```

2. Verify transaction on explorer
   ```
   https://explorer.solana.com/tx/<signature>
   ```

3. Check Helius webhook logs
   ```bash
   curl -X GET https://api.helius.xyz/v0/webhook-logs \
     -H "Authorization: Bearer $HELIUS_API_KEY"
   ```

#### 2. Off-ramp Delays

**Symptoms:**
- Transaction confirmed but no off-ramp
- Helio transfer pending
- Bank transfer delayed

**Solutions:**
1. Check Helio status
   ```bash
   curl -X GET https://api.helio.xyz/v1/status \
     -H "Authorization: Bearer $HELIO_API_KEY"
   ```

2. Verify transfer request
   ```typescript
   const transfer = await helioClient.getTransfer(transferId);
   console.log(transfer.status, transfer.error);
   ```

3. Review bank details
   - Verify account information
   - Check transfer limits
   - Review KYC status

### Integration Issues

#### 1. Clover Connection Problems

**Symptoms:**
- Cannot connect to Clover API
- Order sync failing
- Authentication errors

**Solutions:**
1. Verify API credentials
   ```bash
   curl -X GET https://api.clover.com/v3/merchants/$MERCHANT_ID \
     -H "Authorization: Bearer $ACCESS_TOKEN"
   ```

2. Check API access
   ```typescript
   const merchant = await cloverClient.getMerchant();
   if (!merchant) {
     console.error('Clover connection failed');
   }
   ```

3. Review OAuth setup
   - Check redirect URLs
   - Verify permissions
   - Update tokens

#### 2. Helius Webhook Issues

**Symptoms:**
- Missing transaction updates
- Webhook errors in logs
- Delayed confirmations

**Solutions:**
1. Verify webhook configuration
   ```bash
   curl -X GET https://api.helius.xyz/v0/webhooks \
     -H "Authorization: Bearer $HELIUS_API_KEY"
   ```

2. Check webhook endpoint
   ```bash
   curl -X POST https://your-api.com/webhooks/helius \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

3. Review logs
   ```typescript
   const logs = await getWebhookLogs();
   console.log('Failed webhooks:', logs.filter(log => log.status === 'failed'));
   ```

### Database Issues

#### 1. Connection Problems

**Symptoms:**
- Database timeout errors
- Connection pool exhausted
- Slow query responses

**Solutions:**
1. Check connection pool
   ```typescript
   const pool = {
     min: 2,
     max: 10,
     idleTimeoutMillis: 30000
   };
   ```

2. Monitor connections
   ```sql
   SELECT * FROM pg_stat_activity 
   WHERE datname = 'your_database';
   ```

3. Review connection settings
   - Check max connections
   - Verify credentials
   - Test network access

#### 2. Migration Issues

**Symptoms:**
- Failed migrations
- Schema inconsistencies
- Data integrity issues

**Solutions:**
1. Check migration status
   ```bash
   npm run migration:status
   ```

2. Review migration logs
   ```bash
   npm run migration:logs
   ```

3. Reset if necessary
   ```bash
   npm run migration:reset
   npm run migration:latest
   ```

### Performance Issues

#### 1. Slow Response Times

**Symptoms:**
- API endpoints slow
- UI loading delays
- Transaction processing delays

**Solutions:**
1. Check server resources
   ```bash
   top -u your_user
   ```

2. Monitor API latency
   ```typescript
   const startTime = Date.now();
   await apiCall();
   console.log(`Latency: ${Date.now() - startTime}ms`);
   ```

3. Review database queries
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM transactions
   WHERE merchant_id = $1;
   ```

#### 2. Memory Issues

**Symptoms:**
- Out of memory errors
- Server crashes
- Performance degradation

**Solutions:**
1. Check memory usage
   ```bash
   free -m
   ```

2. Monitor Node.js heap
   ```typescript
   const used = process.memoryUsage();
   console.log(`Memory usage: ${used.heapUsed / 1024 / 1024} MB`);
   ```

3. Review memory limits
   - Check container limits
   - Adjust Node.js flags
   - Optimize memory usage

## Diagnostic Tools

### 1. Logging Tools
```typescript
const logger = {
  error: (msg: string, error: Error) => {
    console.error(msg, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
};
```

### 2. Monitoring Tools
```typescript
const metrics = {
  recordLatency: (operation: string, duration: number) => {
    // Implementation
  },
  
  trackError: (type: string, error: Error) => {
    // Implementation
  }
};
```

### 3. Debug Tools
```typescript
const debug = {
  transaction: (tx: Transaction) => {
    console.log('Transaction Debug:', {
      signature: tx.signature,
      status: tx.status,
      timestamp: tx.timestamp
    });
  }
};
```

## Support Resources

### 1. Contact Information
```yaml
Technical Support:
  Email: support@example.com
  Hours: 24/7
  Response Time: < 1 hour

Emergency Support:
  Phone: +1-xxx-xxx-xxxx
  Available: 24/7
  Priority: P1 issues only
```

### 2. Documentation
- API Documentation
- Integration Guides
- Error Code Reference
- Best Practices Guide

### 3. Community Resources
- GitHub Issues
- Developer Forum
- Stack Overflow Tags
- Discord Channel