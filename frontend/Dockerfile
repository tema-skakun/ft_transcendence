FROM node:19.8.1-alpine AS compile

# Existing folder in alpine
WORKDIR /app

# Any Os-level dependencies (build dependencies)
RUN apk add --no-cache musl-dev make g++ python3 build-base cairo-dev jpeg-dev pango-dev giflib-dev libpng-dev libpq

#copying in the sources
COPY package*.json .
# install node dependencies // no --production flag yet.
RUN npm i

COPY . .

RUN npm run build

FROM nginx:1.21.0-alpine AS run
COPY --from=compile /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
