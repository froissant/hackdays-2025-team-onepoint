FROM node:24 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:1.27.5

COPY --from=build /app/dist /usr/share/nginx/html
# COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
