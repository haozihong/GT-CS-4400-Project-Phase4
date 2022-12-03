FROM gradle:7.4-jdk17 AS build
COPY --chown=gradle:gradle . /home/app
WORKDIR /home/app
RUN mkdir -p rse-react/node_modules/.cache && chmod -R 777 rse-react/node_modules/.cache
RUN mkdir -p rse-react/build && chmod -R 777 rse-react/build
RUN gradle build --no-daemon

FROM openjdk:17-slim
COPY --from=build /home/app/rse-api/build/libs/*.jar /usr/local/lib/app.jar
ENV PORT 8080
EXPOSE $PORT
ENTRYPOINT java -Dserver.port=$PORT -jar /usr/local/lib/app.jar --spring.profiles.active=prod
