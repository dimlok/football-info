.PHONY: help dev build preview lint clean install

# Default target when just running 'make'
help:
	@echo "🏆 Football Info - Available Commands:"
	@echo ""
	@echo "  make dev       - Start development server"
	@echo "  make build     - Build for production"
	@echo "  make preview   - Preview production build"
	@echo "  make lint      - Run ESLint"
	@echo "  make install   - Install dependencies"
	@echo "  make clean     - Remove node_modules and build files"
	@echo ""

# Start development server
dev:
	@echo "🚀 Starting development server..."
	pnpm dev

# Build for production
build:
	@echo "📦 Building for production..."
	pnpm build

# Preview production build
preview:
	@echo "👀 Starting preview server..."
	pnpm preview

# Run linter
lint:
	@echo "🔍 Running ESLint..."
	pnpm lint

# Install dependencies
install:
	@echo "📥 Installing dependencies..."
	pnpm install

# Clean build artifacts and node_modules
clean:
	@echo "🧹 Cleaning..."
	rm -rf node_modules
	rm -rf dist
	@echo "✅ Clean complete!"

# Reinstall everything
reinstall: clean install
	@echo "✅ Reinstall complete!"

