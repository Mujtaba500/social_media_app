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

COPY package*.json ./
RUN npm install --production=false

COPY . .

RUN npm run db:client

FROM node:21-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

CMD ["npm", "run", "start"]