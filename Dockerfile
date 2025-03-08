# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies and PostgreSQL client
RUN apk add --no-cache postgresql-client python3 make g++ bash

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally for hot reload
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Copy entrypoint script and ensure it is executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Use nodemon for hot reload in development
CMD ["npm", "run", "dev" "./entrypoint.sh"]
