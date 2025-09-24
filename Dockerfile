# Dockerfile
# Multi-stage build for Node.js application with MySQL client

FROM node:18-slim AS base

# Install MySQL client and other system dependencies
RUN apt-get update && \
    apt-get install -y \
        default-mysql-client \
        curl \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY package*.json ./

# Install Node.js dependencies (changed from npm ci)
RUN npm install --omit=dev && \
    npm cache clean --force

# Copy application source code
COPY . .

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /usr/src/app
USER appuser

# Health check (commented out since we don't have HTTP server)
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:3000/health || exit 1

# Expose port (if adding HTTP server later)
EXPOSE 3000

# Default command
CMD ["npm", "start"]
