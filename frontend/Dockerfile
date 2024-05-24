# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the app for production
RUN npm run build

# Install a simple static file server to serve the build
RUN npm install -g serve

# Expose port 3000 to be able to access the application
EXPOSE 3000

# Command to run the static file server
CMD ["serve", "-s", "build", "-l", "3000"]