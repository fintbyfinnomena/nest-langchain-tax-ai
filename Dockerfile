# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the application
CMD ["npm", "run", "start:prod"]