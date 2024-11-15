#build with TS and Vite
FROM node:18-alpine AS build
WORKDIR /app
ARG VITE_API_URL="http://localhost:8080/api/"
ENV VITE_API_URL=$VITE_API_URL
ADD ./frontend .
RUN npm i
RUN npm run build

#deploy with java 21
FROM nginx AS deploy
WORKDIR /app

EXPOSE 80
COPY --from=build /app/deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /app
