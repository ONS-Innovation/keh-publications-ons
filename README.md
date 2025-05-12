# KEH - ONS Publications PoC

# Getting Started

## Prerequisites
### Node.js
This project requires Node.js version 20.18.0. To install Node.js:

1. Visit [Node.js official website](https://nodejs.org/)
2. Download and install version 20.18.0
3. Alternatively, use a version manager like nvm:
   ```bash
   nvm install 20.18.0
   nvm use 20.18.0
   ```
4. Verify installation by running:
   ```bash
   node --version  # Should output v20.18.0
   npm --version
   ```

## Project Setup

1. Clone the repository
   ```bash
   git clone https://github.com/ONS-Innovation/keh-publications-ons.git
   cd publications-poc
   ```

2. Install dependencies
   ```bash
   make install
   ```

## Development

Start the development server:

```bash
make dev
```

## Linting

Run the linter (also used in [GitHub Action](.github/workflows/linter.yml)):

```bash
make lint
```

## Terraform

Follow these instructions in the central documenation to configure the Terraform:

[Terraform Commands](https://github.com/ONS-Innovation/keh-central-documentation/blob/d42e7b4505c0433bac4fd637a0742b4ba7ee6659/terraform/COMMANDS.md)

When deploying the new service and its resources, deploy in this order:

1. Storage
2. Authentication
3. Service