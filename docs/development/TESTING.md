# Testing Guide

This document outlines the testing strategy and practices for the Clover USDC Payment Gateway.

## Testing Strategy

### Test Pyramid
```
    ┌───────┐
    │  E2E  │
    ├───────┤
    │ Integ │
    ├───────┤
    │ Unit  │
    └───────┘
```

1. **Unit Tests**: 70% of test suite
2. **Integration Tests**: 20% of test suite
3. **E2E Tests**: 10% of test suite

## Test Setup

### 1. Testing Tools

```json
{
  "dependencies": {
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@testing-library/react": "^13.0.0",
    "cypress": "^12.0.0",
    "msw": "^1.0.0"
  }
}
```

### 2. Test Configuration

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

## Unit Testing

### 1. Component Testing

```typescript
// Example Component Test
describe('PaymentQR', () => {
  it('should generate QR code with correct payment URL', () => {
    const amount = 100;
    const recipient = 'wallet123';
    
    render(<PaymentQR amount={amount} recipient={recipient} />);
    
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
  });
});
```

### 2. Service Testing

```typescript
// Example Service Test
describe('PaymentService', () => {
  it('should process payment transaction', async () => {
    const payment = {
      amount: 100,
      currency: 'USDC',
      recipient: 'wallet123'
    };
    
    const result = await PaymentService.process(payment);
    expect(result.status).toBe('success');
  });
});
```

### 3. API Route Testing

```typescript
// Example API Test
describe('POST /api/payments', () => {
  it('should create new payment', async () => {
    const response = await request(app)
      .post('/api/payments')
      .send({
        amount: 100,
        currency: 'USDC'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
```

## Integration Testing

### 1. External Service Mocking

```typescript
// Example Service Mock
const mockCloverAPI = {
  createOrder: jest.fn(),
  updateOrder: jest.fn()
};

describe('Payment Flow', () => {
  it('should complete full payment cycle', async () => {
    mockCloverAPI.createOrder.mockResolvedValue({
      id: 'order123',
      status: 'created'
    });
    
    // Test implementation
  });
});
```

### 2. Database Integration

```typescript
// Example Database Test
describe('Database Operations', () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });
  
  afterEach(async () => {
    await db.migrate.rollback();
  });
  
  it('should store transaction', async () => {
    const transaction = {
      merchantId: 1,
      amount: 100,
      status: 'pending'
    };
    
    const result = await db('transactions').insert(transaction);
    expect(result).toBeDefined();
  });
});
```

## E2E Testing

### 1. Cypress Tests

```typescript
// Example Cypress Test
describe('Payment Flow', () => {
  it('should complete payment', () => {
    cy.visit('/payment/new');
    cy.get('[data-testid="amount-input"]').type('100');
    cy.get('[data-testid="pay-button"]').click();
    cy.get('[data-testid="qr-code"]').should('be.visible');
    cy.get('[data-testid="status"]').should('contain', 'completed');
  });
});
```

### 2. Test Environment

```typescript
// cypress.config.ts
export default {
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      MOCK_PAYMENT: true
    }
  }
};
```

## CI/CD Integration

### 1. GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

### 2. Test Coverage

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "statements": 80,
        "branches": 80,
        "functions": 80,
        "lines": 80
      }
    }
  }
}
```

## Test Data Management

### 1. Test Fixtures

```typescript
// fixtures/merchants.ts
export const testMerchants = [
  {
    id: 1,
    name: 'Test Merchant',
    clover_id: 'clover123',
    wallet_address: 'wallet123'
  }
];
```

### 2. Database Seeding

```typescript
// seeds/test-data.ts
export async function seed(knex: Knex) {
  await knex('merchants').insert(testMerchants);
  await knex('transactions').insert(testTransactions);
}
```

## Best Practices

### 1. Testing Guidelines
- Write tests before code (TDD)
- One assertion per test
- Clear test descriptions
- Proper test isolation
- Mock external dependencies

### 2. Code Coverage
- Maintain minimum 80% coverage
- Focus on critical paths
- Regular coverage reports
- Coverage gates in CI

### 3. Test Maintenance
- Regular test updates
- Remove obsolete tests
- Keep test code clean
- Document test requirements

## Troubleshooting

### Common Issues

1. **Flaky Tests**
   - Identify timing issues
   - Add proper waits
   - Improve test isolation
   - Use retry mechanisms

2. **Performance Issues**
   - Optimize test setup
   - Parallel test execution
   - Proper resource cleanup
   - Mock heavy operations

3. **Integration Issues**
   - Check mock configurations
   - Verify environment variables
   - Validate service endpoints
   - Review test data