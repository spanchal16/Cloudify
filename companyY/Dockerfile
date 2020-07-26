FROM node:12 
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 1337
CMD node app.js

