
# Triolingo

## Opis projekta

Ovaj projekt rezultat je timskog rada razvijenog u sklopu projektnog zadatka kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu.

## Postavljanje - razvojno okruženje

### Frontend

#### Instalacija Node JS-a

Posjetite [Node.js](https://nodejs.org/en/) za instalaciju Node.js-a.

#### Instalacija ovisnosti

U terminalu idite u direktorij `frontend/` i pokrenite:
```bash
npm install
```

#### Pokretanje razvojnog poslužitelja

Za pokretanje Vite aplikacije i provjeru je li sve ispravno postavljeno, pokrenite:
```bash
npm run dev
```

### Backend

#### Instalacija Maven-a i Java 21 JDK-a

Posjetite [Maven](https://maven.apache.org/install.html) za instalaciju Maven-a.

Posjetite [Oracle JDK](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html) za instalaciju JDK-a.

#### Pokretanje projekta

Iz direktorija `/backend` pokrenite:
```bash
mvn spring-boot:run
```

## Postavljanje - produkcijsko okruženje

### Instalacija Docker-a

Posjetite [Docker](https://docs.docker.com/engine/install) za instalaciju Docker-a.

### Izrada slika

Dok ste u korijenu projekta, pokrenite:
```bash
docker build -f /backend/deploy/Dockerfile -t triolingo-backend
docker build -f /frontend/deploy/Dockerfile -t triolingo-frontend
```

### Pokretanje kontejnera

U bilo kojem terminalu pokrenite:
```bash
docker run -p 5000:80 triolingo-backend -d
docker run -p 80:80 triolingo-frontend -d
```

### Docker Compose

Alternativno, aplikaciju možete pokrenuti koristeći docker-compose.

Dok ste u korijenu projekta, pokrenite:
```bash
docker compose up -d
```

## Contribuiranje

Molimo pročitajte [CONTRIBUTING.md](https://github.com/Progi-Petrovi/Triolingo/blob/main/CONTRIBUTING.md) prije nego što doprinosite ovom projektu.

## Licenca

Ovaj projekt je zaštićen [MIT licencom](https://github.com/Progi-Petrovi/Triolingo/blob/main/LICENSE).
