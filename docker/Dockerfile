# Use the base image with Node.js
FROM node:11.15.0

RUN useradd -m -s /bin/bash appuser

# Copy the current directory into the Docker image
COPY . /submission-review-api

RUN chown -R appuser:appuser /submission-review-api
USER appuser

# Set working directory for future use
WORKDIR /submission-review-api

# Install the dependencies from package.json
RUN npm install
RUN npm run lint

#CMD npm start
CMD [ "node", "app.js" ]
