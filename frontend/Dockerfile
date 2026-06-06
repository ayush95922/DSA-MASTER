# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
# Set public API URL placeholder for build time, can be proxy-resolved or configured
ENV NEXT_PUBLIC_API_URL /api
RUN npm run build

# Run stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
ENV PORT 3000
ENV NODE_ENV production
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
