#build with TS and Vite
FROM node:18-alpine AS build
WORKDIR /app
ADD . .
RUN npm i
RUN npm run build

#deploy with java 21
FROM nginx AS deploy
WORKDIR /app

EXPOSE 80
COPY --from=build /app/deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /app
