# Triolingo

Student project for FER Software Engineering.

## Setup - development enviroment

### Frontend

#### Installing Node JS

Refer to https://nodejs.org/en/ to install nodejs.

#### Installing dependencies

In the terminal, go to the `frontend/` directory and run

```bash
npm install
```

#### Starting the develepoment server

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

## Setup - production enviroment

### Installing docker

Refer to https://docs.docker.com/engine/install to install the docker engine.

### Building the images

While in the project root, run

```bash
docker build -f /backend/deploy/Dockerfile -t triolingo-backend
docker build -f /frontend/deploy/Dockerfile -t triolingo-frontend
```

### Running the containers

In any terminal, run

```bash
docker run -p 5000:80 triolingo-backend
docker run -p 80:80 triolingo-frontend
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Progi-Petrovi/Triolingo/blob/main/CONTRIBUTING.md) before contributing to this project.

## License

This project is protected under the [MIT license](https://github.com/Progi-Petrovi/Triolingo/blob/main/LICENSE).
