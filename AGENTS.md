# ZHC Agents Guide

## Build/Test Commands
- `pnpm build` - Build with tsdown (Rust-powered bundler)
- `pnpm build:watch` - Build in watch mode for development
- `pnpm start` - Run development server with ts-node
- No test framework configured
- `pnpm reinstall` - Build and reinstall globally

## Code Style
- **Indentation**: 2 spaces (enforced by .editorconfig)
- **Imports**: Use absolute imports from src/, group Node.js built-ins first
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Types**: Use TypeScript strict mode, prefer interfaces over types
- **Files**: Use `.ts` extension, prefer index.ts for barrel exports
- **Error Handling**: Use try/catch blocks, throw Error objects with descriptive messages
- **Functions**: Prefer arrow functions for utilities, regular functions for main exports
- **Variables**: Use const by default, let when reassignment needed
- **Strings**: Use template literals for interpolation, double quotes for simple strings
- **Objects**: Use destructuring for multiple properties, prefer Record<string, T> for maps

## Project Structure
- Entry point: `src/index.ts` with shebang for CLI usage
- Commands in `src/cmds/` with barrel exports
- Utilities in `src/utils/`
- Use chalk for colored console output
- Built with tsdown (configured in tsdown.config.ts)