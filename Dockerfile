# Use official Node LTS
FROM node:20-alpine AS build

WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build   # skip this line if you don't have a build step

# --- Production stage ---
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy only what we need from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
# COPY --from=build /app/dist ./dist        # change to your build output folder
# If no build step, use: COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "start"]   # or: ["node", "dist/index.js"]