FROM node:lts-bookworm AS builder

ADD . /opt/app/

WORKDIR /opt/app/pkg/common/
RUN npx tsc

WORKDIR /opt/app/pkg/gui/
RUN npm run build

WORKDIR /opt/app/pkg/srv/
RUN npx tsc

FROM node:lts-bookworm-slim

RUN mkdir -p /opt/app/pkg/

COPY --from=builder /opt/app/pkg/gui/www /opt/app/pkg/gui/www/
COPY --from=builder /opt/app/pkg/srv /opt/app/pkg/srv/
COPY --from=builder /opt/app/pkg/common /opt/app/pkg/common/

WORKDIR /opt/app/pkg/srv/
CMD ["npm", "start"]