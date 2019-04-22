FROM node

RUN apt-get update && apt-get -y install cron

COPY index.js .riot_api_token /
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile

COPY crontab /etc/cron.d/index-cron

RUN chmod 0644 /etc/cron.d/index-cron

RUN touch /var/log/cron.log
CMD cron && tail -f /var/log/cron.log
