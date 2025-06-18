# visionBoard-cli

[![PR Test](https://github.com/OpenPathfinder/visionBoard-cli/actions/workflows/pr-test.yml/badge.svg)](https://github.com/OpenPathfinder/visionBoard-cli/actions/workflows/pr-test.yml)

A command-line interface (CLI) tool for interacting with the visionBoard API.


## Requirements

- Node.js (Latest LTS version recommended)

## Installation

### From npm

```bash
npm install -g @openpathfinder/visionboard-cli
```

### From source

```bash
# Clone the repository
git clone https://github.com/OpenPathfinder/visionBoard-cli.git
cd visionBoard-cli

# Install dependencies
npm install

# Build the project
npm run build

# Create a global symlink (to use the CLI from anywhere)
npm link
```

### Using npx

```bash
npx @openpathfinder/visionboard-cli
```

## Usage

Once installed, you can run the CLI using:

```bash
visionboard
```

This will display the help information with available commands.

## Configuration

The visionBoard CLI supports configuration through environment variables:

### Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `VISIONBOARD_INSTANCE_URL` | URL of the visionBoard API instance | `http://localhost:3000` |

**Note**: The URL must include a protocol (http:// or https://).

Example usage:

```bash
# Set the API URL for a single command
VISIONBOARD_INSTANCE_URL=https://api.visionboard.example.com visionboard

# Or export it for the current session
export VISIONBOARD_INSTANCE_URL=https://api.visionboard.example.com
visionboard
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode (without building)
npm run dev

# Build the TypeScript code
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type:check
```

## Project Structure

```
├── .github/workflows/  # GitHub Actions workflows
├── dist/               # Compiled JavaScript output
├── src/                # Source code
│   ├── __tests__/      # Test files
│   └── index.ts        # Main entry point
├── jest.config.js      # Jest configuration
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## CI Pipeline

The project includes a GitHub Actions workflow for continuous integration that runs on pull requests to the main branch and when commits are pushed to main. The pipeline performs the following checks in optimized order:

- Linting with StandardJS
- Type checking with TypeScript
- Building the project
- Running tests with coverage reporting
- Verifying binary execution

The pipeline runs on multiple platforms and Node.js versions to ensure maximum compatibility:

- **Operating Systems**: Ubuntu, Windows, and macOS
- **Node.js Versions**: 18.x, 20.x, 22.x, 24.x

Test coverage reports are automatically uploaded as artifacts for each platform and Node.js version combination.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Ulises Gascón — see [LICENSE](LICENSE)
