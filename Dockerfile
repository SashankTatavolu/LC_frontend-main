# Use the official Node.js image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Install Git
RUN apk add --no-cache git

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
