FROM node:8-alpine

MAINTAINER Paolo Chiabrera <paolo.chiabrera@gmail.com>

ADD package.json /tmp/package.json

ADD yarn.lock /tmp/yarn.lock

RUN cd /tmp && yarn install

RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app

ADD . /home/app

WORKDIR /home/app

CMD yarn run start