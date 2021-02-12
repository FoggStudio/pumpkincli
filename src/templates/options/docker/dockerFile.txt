FROM node:10.20.1-alpine3.9

RUN mkdir -p /srv/api 

COPY package.json /srv/api
COPY package-lock.json /srv/api
RUN mkdir -p /srv/api/src
COPY ./src /srv/api/src

WORKDIR /srv/api

RUN npm ci

CMD ["npm", "start"]