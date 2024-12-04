# Use the base image with Node.js
FROM node:latest

# Copy the current directory into the Docker image
COPY . /submission-review-api

# Set working directory for future use
WORKDIR /submission-review-api

# Install the dependencies from package.json
RUN npm install
RUN npm run lint

#CMD npm start
CMD [ "node", "app.js" ]
