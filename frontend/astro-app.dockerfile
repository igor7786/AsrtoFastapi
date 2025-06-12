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
COPY ./frontend /frontend/
RUN npm run build

# Set environment variables for development
FROM base AS runtime
COPY --from=dev-deps /frontend/node_modules ./node_modules
COPY --from=build /frontend/dist ./dist

###PROD#####


#FROM node:20-alpine AS base
#WORKDIR /frontend

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
## Therefore, the `-deps` steps will be skipped if only the source code changes.
#COPY frontend/package.json frontend/package-lock.json ./
#
#FROM base AS prod-deps
#RUN npm install --omit=dev
#
#FROM base AS build-deps
#RUN npm install
#
#FROM build-deps AS build
#COPY ./frontend /frontend/
#RUN npm run build
#
#FROM base AS runtime
## Copy dependencies
#COPY --from=prod-deps /frontend/node_modules ./node_modules
## Copy the built output
#COPY --from=build /frontend/dist ./dist