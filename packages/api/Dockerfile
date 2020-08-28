FROM node:14.9.0-alpine

WORKDIR /app

COPY ./packages/api/package.json yarn.lock /app/

RUN yarn --production --frozen-lockfile --cache-folder /dev/shm/yarn

COPY ./packages/api/knexfile.js /app/
COPY ./packages/api/migrations /app/migrations
COPY ./packages/api/dist /app/dist

USER node

ENV NODE_ENV=production

CMD ["yarn", "start:prod"]
