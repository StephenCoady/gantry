FROM mhart/alpine-node:7.4

ADD . /app  
WORKDIR /app  
RUN npm install  
EXPOSE 3000
ENV ENV prod

CMD ["node", "app.js"]  
