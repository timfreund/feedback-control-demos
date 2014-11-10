FROM node:latest
RUN npm install -g bower brunch
RUN mkdir /code
ADD ./.bowerrc /code/
ADD ./bower.json /code/
ADD ./config.coffee /code/
ADD ./package.json /code/
WORKDIR /code
RUN bower --allow-root install
RUN npm install
VOLUME ["/code/app", "/code/public"]
