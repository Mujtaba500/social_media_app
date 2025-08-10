# FROM node:21

# WORKDIR /app

# COPY . .

# RUN npm install
# RUN npm run db:client

# EXPOSE 4000

# CMD ["npm", "run", "start"]


#
# -> New implementation to reduce build size. Use light weight OS
#    image and exclude dev dependencies
#

FROM node:21-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production && \
    npm cache clean --force && \
    rm -rf /root/.npm 

COPY . .

RUN npm run db:client

CMD ["npm", "run", "start"]