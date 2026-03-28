FROM node:20-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production


CMD ["node", "dist/app.js"]