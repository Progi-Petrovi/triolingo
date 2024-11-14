# Triolingo

Student project for FER Software Engineering.

## Setup - development environment

### Frontend

#### Installing Node JS

Refer to https://nodejs.org/en/ for installing node.js.

#### Installing dependencies

In the terminal, go to the `frontend/` directory and run
```bash
npm install
```

#### Starting the development server

To start the Vite app and test whether you've done everything correctly, run
```bash
npm run dev
```

### Backend

#### Installing Maven and Java 21 JDK

Refer to https://maven.apache.org/install.html for installing Maven.

Refer to https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html for installing the JDK.

#### Running project

From the `/backend` directory, run
```sh
mvn spring-boot:run
```

## Setup - production environment

### Installing docker

Refer to https://docs.docker.com/engine/install for installing the docker engine.

### Building the images

While in the project root, run
```bash
docker build -f /backend/deploy/Dockerfile -t triolingo-backend
docker build -f /frontend/deploy/Dockerfile -t triolingo-frontend
```

### Running the containers

In any terminal, run
```bash
docker run -p 5000:80 triolingo-backend -d
docker run -p 80:80 triolingo-frontend -d
```

### Docker Compose

Alternatively, you can run the application using docker-compose.

While in the project root, run
```bash
 docker compose up -d
```


## Contributing

Please read [CONTRIBUTING.md](https://github.com/Progi-Petrovi/Triolingo/blob/main/CONTRIBUTING.md) before contributing to this project.

## License

This project is protected under the [MIT license](https://github.com/Progi-Petrovi/Triolingo/blob/main/LICENSE).
