FROM node:20-alpine

WORKDIR /app

ARG VITE_SERVER_URI=http://localhost:5000/api/v1/todo
ENV VITE_SERVER_URI=$VITE_SERVER_URI

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]


