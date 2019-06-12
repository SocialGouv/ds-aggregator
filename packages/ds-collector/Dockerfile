ARG NODE_VERSION=10.15.3

FROM node:${NODE_VERSION} as builder
WORKDIR /app

COPY packages/ds-collector /app
COPY yarn.lock /app/yarn.lock

RUN yarn
RUN yarn build

FROM node:${NODE_VERSION}

ENV API_PORT=1337

WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

EXPOSE ${API_PORT}

CMD [ "yarn", "start"]
