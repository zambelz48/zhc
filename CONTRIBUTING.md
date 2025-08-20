# Contributing to ZHC

Thank you for your interest in contributing to ZHC! This guide will help you get started with development and contributing to the project.

## Development Setup

### Prerequisites
- Node.js 20 or later
- pnpm 10 or later

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/zhc.git
   cd zhc
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Test the CLI**
   ```bash
   node dist/index.js --help
   ```

5. **Development mode** (with watch for changes)
   ```bash
   pnpm build:watch
   ```

## Project Structure

```
src/
├── cmds/           # Command implementations
│   ├── api/        # API-related commands
│   ├── config/     # Configuration management
│   └── profile-management/  # Profile management
├── utils/          # Utility functions
└── index.ts        # Main entry point
```

## Code Style

- **Indentation**: 2 spaces (enforced by .editorconfig)
- **Imports**: Use absolute imports from `src/`, group Node.js built-ins first
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Types**: Use TypeScript strict mode, prefer interfaces over types
- **Error Handling**: Use try/catch blocks, throw Error objects with descriptive messages
- **Functions**: Prefer arrow functions for utilities, regular functions for main exports
- **Variables**: Use const by default, let when reassignment needed
- **Strings**: Use template literals for interpolation, double quotes for simple strings

### Example Code Style

```typescript
import { readFileSync } from "fs";
import { join } from "path";

import { logger } from "src/utils/logger";
import { validateConfig } from "src/utils/config";

interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

const DEFAULT_TIMEOUT = 5000;

export const createApiClient = (config: ApiConfig): ApiClient => {
  const { baseUrl, timeout = DEFAULT_TIMEOUT } = config;
  
  return {
    async request(endpoint: string) {
      try {
        const response = await fetch(`${baseUrl}/${endpoint}`);
        return await response.json();
      } catch (error) {
        throw new Error(`API request failed: ${error.message}`);
      }
    }
  };
};
```

## Making Changes

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Follow the code style guidelines
- Add tests if applicable
- Update documentation if needed

### 3. Test Your Changes
```bash
# Build the project
pnpm build

# Test CLI functionality
node dist/index.js --version
node dist/index.js --help

# Test specific commands
node dist/index.js config --help
node dist/index.js api --help
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

### Commit Message Format
Follow conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Requirements**
   - Clear description of changes
   - Reference any related issues
   - All CI checks must pass
   - Code review approval required

## Testing

Currently, there's no formal test framework configured. Testing is done through:
- Building the project successfully
- Manual CLI testing
- CI/CD pipeline verification

We welcome contributions to improve our testing setup!

## Documentation

- Keep README.md up to date
- Update GUIDE.md for user-facing changes
- Add JSDoc comments for complex functions
- Update this contributing guide if development process changes

## Getting Help

- Check existing [issues](https://github.com/zambelz48/zhc/issues)
- Create a new issue for bugs or feature requests
- Join discussions in existing issues

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help maintain a welcoming environment
- Focus on technical merit in discussions

## Release Process

Release management is handled by maintainers. See [docs/RELEASE.md](./RELEASE.md) for details.

---

Thank you for contributing to ZHC! 🚀