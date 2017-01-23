FROM node:6.9.1-slim

ADD . /app  
WORKDIR /app  
RUN npm install  
EXPOSE 3000
ENV ENV prod

CMD ["node", "app.js"]  
