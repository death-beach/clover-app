# Next.js Solana Dashboard with Helius Integration

A Next.js 13+ dashboard application with Helius integration for Solana transaction monitoring and role-based access control.

## Features

### Helius Integration
- **Transaction Monitoring**
  - Real-time transaction tracking
  - Enhanced transaction data
  - Network configuration support
  - RPC endpoint access
  - Webhook integration capability

### Role-Based Access Control
- Multiple user roles with specific permissions
- Dynamic permission system
- Protected routes
- Role-specific UI elements

### Dashboard Interface
- Responsive layout
- Dynamic navigation
- Role-based components
- Protected routes

### Blockchain Infrastructure
- **Helius Integration**
  - Real-time transaction tracking
  - Enhanced transaction data
  - Network configuration (mainnet/devnet)
  - RPC endpoint access
  - Webhook support

## Installation

### Prerequisites
- Node.js 16+
- Next.js 13+
- Helius API key

### Quick Start
1. Clone the repository
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
# Create .env file with:
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key
SOLANA_NETWORK=mainnet/devnet
```

4. Start the development server
```bash
npm run dev
```

## Usage

### Helius Client Integration
```typescript
// Initialize Helius client
const heliusClient = new HeliusClient({
    apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY,
    rpcEndpoint: `https://${network}.helius-rpc.com/${apiKey}`
});

// Get transaction details
const getTransactionDetails = async (signature: string) => {
    const enrichedTx = await heliusClient.getEnrichedTransaction(signature);
    return enrichedTx;
};
```

### Role-Based Access Implementation
```typescript
// Protected component usage
<ProtectedComponent requiredRole={UserRole.ADMIN}>
    <AdminDashboard />
</ProtectedComponent>
```

## Documentation
For detailed documentation, please see the [docs/documentation.md](docs/documentation.md) file.

## Security Features
- Role-based access control
- Protected routes
- Environment variable protection
- Type safety with TypeScript

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with Next.js, TypeScript, and Helius