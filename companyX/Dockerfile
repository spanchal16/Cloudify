FROM node:7
WORKDIR /usr/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
EXPOSE 1337
CMD [ "npm", "start" ]