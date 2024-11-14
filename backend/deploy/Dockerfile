#build with maven
FROM maven:latest AS build
WORKDIR /app
ADD ./backend .
RUN mvn package

#deploy with java 21
FROM bellsoft/liberica-openjdk-alpine:21 AS deploy
WORKDIR /app

EXPOSE 5000
COPY --from=build /app/target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]