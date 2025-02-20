# Changelog

All notable changes to the Clover USDC Payment Gateway will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Core payment processing functionality
- Basic merchant dashboard
- Integration with Clover POS
- Solana Pay implementation
- Helius webhook integration
- Helio off-ramp integration

### Changed
- Simplified role system to use Clover roles
- Streamlined payment flow
- Optimized database schema

### Removed
- Complex role management system
- Unused feature implementations
- Legacy code components

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
- Core payment processing
- Merchant dashboard
- Transaction management
- Off-ramp automation

### Security
- End-to-end encryption
- Secure webhook endpoints
- Role-based access control

## Types of Changes

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

## Versioning

Given a version number MAJOR.MINOR.PATCH, increment the:

1. MAJOR version when you make incompatible API changes
2. MINOR version when you add functionality in a backward compatible manner
3. PATCH version when you make backward compatible bug fixes

## Release Process

1. Update the Unreleased section with changes
2. Move Unreleased changes to new version section
3. Update version number in package.json
4. Create git tag for version
5. Push to repository

## Version History Template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Change description

### Deprecated
- Feature to be removed

### Removed
- Removed feature

### Fixed
- Bug fix description

### Security
- Security fix description
```