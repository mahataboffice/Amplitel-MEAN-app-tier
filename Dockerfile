
FROM node:16
# Creating a node user
RUN npm install --global nodemon
# RUN apk upgrade --update-cache --available && \
#     apk add openssl && \
#     apk add git && \
#     rm -rf /var/cache/apk/*
# RUN openssl version
RUN node --version

ENV MONGO_URL=mongodb://172.17.0.1:27017/telstras
ENV blowfishSecretKey=000102030405060708090A0B0C0D0E0F

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ./package.json ./
# USER appuser 
USER node
RUN npm install;
# COPY ./s3.js ./node_modules/s3-proxy/lib/s3.js
USER root
# RUN apk del git
USER node
COPY --chown=node:node . ./
COPY . ./
EXPOSE 9000
CMD ["npm","run","dev"]









