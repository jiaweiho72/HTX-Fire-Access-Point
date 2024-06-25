- Docker

```bash
# This is the build the image from the dockerfile
# -t tags the image with the name 'map-frontend'
# . specifies the build context -> directory of where the dockerfile etc is at
docker build -t map-frontend .

# Run a docker container based on the image 'map-frontend'
# -p specifies port mapping between container and host
# Binds 4000 on host machine to 3000 inside the docker container
# Port mapping allows you to access services running inside the Docker container from outside the container.
# Nextjs by default runs apps on port 3000
docker run -p 4000:3000 map-frontend

# List ALL containers, including stopped ones
docker ps -a

# Run docker compose file (For multiple containers)
docker-compose up

# Stop the service
docker-compose down

```

- Backend

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000

```


Create .env environment file
