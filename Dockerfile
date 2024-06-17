FROM node:lts-bookworm AS builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        default-jdk

ADD . /opt/app/

WORKDIR /opt/app/
RUN npm i -g corepack && \
    corepack enable && \
    corepack prepare yarn@4.2.1 --activate && \
    yarn set version 4.2.1 && \
    yarn install

WORKDIR /opt/app/pkg/common/
RUN yarn codegen
RUN yarn build

WORKDIR /opt/app/pkg/gui/
RUN yarn build:prod

WORKDIR /opt/app/pkg/srv/
RUN yarn build

FROM node:lts-bookworm-slim

RUN mkdir -p /opt/app/pkg/

COPY --from=builder /opt/app/pkg/gui/dist/scout-db-gui /opt/app/pkg/gui/dist/scout-db-gui/
COPY --from=builder /opt/app/pkg/srv /opt/app/pkg/srv/
COPY --from=builder /opt/app/pkg/common /opt/app/pkg/common/

VOLUME [ "/data/scoutdb" ]

WORKDIR /opt/app/pkg/srv/
CMD ["npm", "start"]