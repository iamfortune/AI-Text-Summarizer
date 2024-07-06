FROM node:20-alpine

ARG VITE_AI_URL
ENV VITE_AI_URL=$VITE_AI_URL

ENV APP_HOME=/home/app/node/

WORKDIR $APP_HOME

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY . .

RUN npm install
RUN cd services/devotion && \
    npm install && \
    npm run build

EXPOSE 3042

CMD ["npm", "start"]