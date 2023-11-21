FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

COPY . /app

RUN chmod +x ./gradlew

RUN --mount=type=cache,target=/root/.gradle ./gradlew clean build

RUN mkdir -p build/dependency && (cd build/dependency; jar -xf ../libs/*-SNAPSHOT.jar)


FROM eclipse-temurin:17-jdk-alpine

VOLUME /tmp

ARG DEPENDENCY=/app/build/dependency

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib

COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF

COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","com.heckerForum.heckerForum.HeckerForumApplication"]
