#build with maven
FROM maven:latest AS build
WORKDIR /app
ADD ./backend .
RUN mvn package -Dmaven.test.skip

#deploy with java 21
FROM bellsoft/liberica-openjdk-alpine:21 AS deploy
WORKDIR /app

RUN mkdir -p /app/public/images/profile

EXPOSE 5000
COPY --from=build /app/target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]