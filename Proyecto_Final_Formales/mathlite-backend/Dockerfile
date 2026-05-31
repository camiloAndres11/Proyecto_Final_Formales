# Etapa de construcción (Build)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copiar archivos del proyecto
COPY pom.xml .
COPY src ./src
# Compilar el proyecto
RUN mvn clean package -DskipTests

# Etapa de ejecución (Run)
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copiar el jar generado desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]
