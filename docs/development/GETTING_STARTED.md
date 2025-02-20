# Getting Started Guide

This guide will help you set up and run the Clover USDC Payment Gateway development environment.

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 14+
- Solana CLI tools
- A Clover Developer account
- Access to Helio and Helius APIs

## Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd clover-usdc-gateway
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   # Auth
   PRIVY_APP_ID=your_privy_app_id
   CLOVER_CLIENT_ID=your_clover_client_id
   CLOVER_CLIENT_SECRET=your_clover_secret

   # Solana
   HELIUS_API_KEY=your_helius_key
   
   # Helio
   HELIO_API_KEY=your_helio_key
   HELIO_WEBHOOK_SECRET=your_webhook_secret
   
   # Database
   DATABASE_URL=your_database_url
   ```

4. Initialize the database:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── app/              # Next.js 13+ App Router
  ├── components/       # Reusable UI components
  ├── lib/             # Core business logic
  ├── config/          # Configuration files
  ├── types/           # TypeScript definitions
  └── hooks/           # Custom React hooks
```

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the project's code style

3. Test your changes:
   ```bash
   npm run test        # Run unit tests
   npm run lint        # Run linting
   ```

4. Submit a pull request

## Testing

- Unit tests: `npm run test`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`

## Common Development Tasks

### Adding New API Endpoints
1. Create new route in `src/app/api/`
2. Add validation
3. Implement error handling
4. Update types if needed

### Adding UI Components
1. Create component in `src/components/`
2. Add TypeScript types
3. Implement component logic
4. Add to relevant pages

### Database Changes
1. Create migration
2. Update schema
3. Update TypeScript types
4. Test changes

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check PostgreSQL is running
   - Ensure database exists

2. **API Key Issues**
   - Verify all API keys are set
   - Check key permissions
   - Ensure keys are valid

3. **Build Errors**
   - Clear `.next` directory
   - Delete `node_modules`
   - Reinstall dependencies

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clover API Documentation](https://docs.clover.com/)
- [Solana Pay Documentation](https://docs.solanapay.com/)
- [Helius Documentation](https://docs.helius.xyz/)