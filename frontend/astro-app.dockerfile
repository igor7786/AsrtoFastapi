# Use the official Node.js LTS version as the base image for all stages
FROM node:lts AS base
WORKDIR /frontend

# Copy only package.json and package-lock.json initially to leverage Docker caching
COPY frontend/package.json frontend/package-lock.json ./

# Install all dependencies, including devDependencies (necessary for development)
FROM base AS dev-deps
RUN npm install

# Copy the entire source code into the container
FROM dev-deps AS build
COPY ./frontend .
RUN npm run build

# Set environment variables for development
FROM base AS runtime
COPY --from=dev-deps /frontend/node_modules ./node_modules
COPY --from=build /frontend/dist ./dist

# Command to run the application in development mode
CMD ["npm", "run", "dev"]