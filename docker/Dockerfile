FROM node:16-alpine AS build
WORKDIR /dist/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.20.2-alpine AS ngi
COPY --from=build /dist/src/app/dist/koga-wash-frontend /usr/share/nginx/html
COPY --from=build /dist/src/app/docker/nginx_default/app.conf /etc/nginx/conf.d/app.conf
EXPOSE 80
