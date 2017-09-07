FROM node:8

MAINTAINER Paolo Chiabrera <paolo.chiabrera@gmail.com>

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN groupadd --system nightmare && useradd --system --create-home --gid nightmare nightmare

ENV HOME "/home/nightmare"

RUN apt-get update && apt-get install -y \
  xvfb \
  x11-xkb-utils \
  xfonts-100dpi \
  xfonts-75dpi \
  xfonts-scalable \
  xfonts-cyrillic \
  x11-apps \
  clang \
  libdbus-1-dev \
  libgtk2.0-dev \
  libnotify-dev \
  libgnome-keyring-dev \
  libgconf2-dev \
  libasound2-dev \
  libcap-dev \
  libcups2-dev \
  libxtst-dev \
  libxss1 \
  libnss3-dev \
  gcc-multilib \
  g++-multilib

ADD package.json /tmp/package.json

ADD yarn.lock /tmp/yarn.lock

RUN cd /tmp && yarn install

RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app

ADD . /home/app

WORKDIR /home/app

CMD xvfb-run node cluster.js