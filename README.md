# 🪨 Mantle

Unified business operations suite for Omni.

Mantle combines CRM, invoicing, quotes, and inventory management into a single, cohesive platform.

## Modules

- **People**: Contact and relationship management (CRM)
- **Invoices**: Professional invoice creation and tracking
- **Quotes & Contracts**: Proposal and agreement management
- **Inventory**: Product inventory tracking

## Architecture

Mantle is a monolith with clear module boundaries, designed for easy extraction if needed:

```
mantle/
├── services/
│   ├── mantle-api/          # Unified API (Postgraphile + Drizzle + Elysia)
│   └── mantle-app/          # TanStack Start app
│       └── src/
│           ├── features/
│           │   ├── people/
│           │   ├── invoices/
│           │   ├── quotes/
│           │   └── inventory/
│           └── routes/
│               ├── people/
│               ├── invoices/
│               ├── quotes/
│               └── inventory/
├── weaver.yaml
└── Tiltfile
```

## Development

```bash
# Clone and setup
weaver sync

# Start local dev
tilt up

# Or run services directly
cd services/mantle-app && bun dev
cd services/mantle-api && bun dev
```

## Documentation

See [Mantle docs](https://docs.omni.dev/products/mantle) for full documentation.

## License

The code in this repository is licensed under Apache 2.0, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.
