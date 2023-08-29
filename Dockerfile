# Development stage
FROM node:18 as development
WORKDIR server.js
COPY package*.json ./
RUN npm install
COPY ./src ./src
CMD [ "npm", "run", "start:dev" ]
