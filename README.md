### DOCKER COMMANDS
## SERVER

#==================================#
     ***  ALL COMMAND RUN ON MAIN ROOT DIR ***
#==================================#

- DOCKER SERVER IMAGE
```bash

docker build -t docker-course-server ./server

```
#### ---- XXXX ----

- DOCKER SERVER CONTAINER USING IMAGE
```bash

docker run -d \
  --name server \
  -e NODE_ENV=development \
  -e PORT=5000 \
  -e MONGODB_URI=mongodb://localhost:27017 \
  -e RATE_LIMIT_WINDOW_MS=15m \
  -e RATE_LIMIT_MAX=100 \
  -e DEAFULT_ROUTE=/todo/api/v1 \
  -e CORS_ORIGIN=http://localhost:4173 \
  -e CLIENT_URL=http://localhost:4173 \
  -e APP_NAME=todo \
  -e BACKEND_URI=http://localhost:5000/todo/api/v1/auth \
  -e ACCESS_TOKEN_SECRET=eyJzdWIiOiIxMjODkSI6IeyyJRtWJhbGciOiJIUzI1NiIsInwIiwibmFtZGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9kpvaG4gRG9lIiwiYWODkSI6IeUsIm \
  -e REFRESH_TOKEN_SECRET=mMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30 \
  -e ACCESS_TOKEN_EXPIRY=1h \
  -e REFRESH_TOKEN_EXPIRY=15d \
  -p 5000:5000 \
  docker-course-server

```


## CLIENT

- DOCKER CLIENT CONTAINER USING IMAGE

```bash

docker build --build-arg VITE_API_URL=http://localhost:5000/api/v1/todo -t docker-course-client ./client


```

#### ---- XXXX ----

- DOCKER SERVER CONTAINER USING IMAGE

```bash

docker run -d --name client -p 4173:4173 docker-course-client

```
