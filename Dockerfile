FROM node:21

WORKDIR /app

COPY . .

RUN npm install
RUN npm run db:client

EXPOSE 4000

CMD ["npm", "run", "dev"]