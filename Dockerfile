FROM mhart/alpine-node:7.4

ADD . /code  
WORKDIR /code  
RUN npm install  
EXPOSE 3000
ENV ENV prod

CMD ["node", "index.js"]  
