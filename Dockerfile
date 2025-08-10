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

FROM node:21-alpine AS builder

WORKDIR /app

COPY . .
RUN npm install --production=false && \
    npm run build

FROM node:21-alpine

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./prisma

RUN npm install --production && \
    npm cache clean --force && \
    rm -rf /root/.npm && \
    cd ./prisma && \
    npx prisma generate && \
    cd ..

CMD ["npm", "run", "start"]