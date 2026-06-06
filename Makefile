.PHONY: dev dev-db dev-backend dev-frontend install build clean

# Start all development services in Docker (Postgres, Redis, RabbitMQ, Elasticsearch)
dev-db:
	docker compose up -d

# Stop development services
stop-db:
	docker compose down

# Install all dependencies for both frontend and backend
install:
	cd backend && mvn dependency:go-offline
	cd frontend && npm install

# Run backend development server
dev-backend:
	cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Run frontend development server
dev-frontend:
	cd frontend && npm run dev

# Run everything in development mode (Make sure you have dev-db running)
dev: dev-db
	@echo "Starting development environment..."
	@echo "Frontend will be on http://localhost:3000"
	@echo "Backend will be on http://localhost:8080"
	@echo "Elasticsearch will be on http://localhost:9200"
	@echo "RabbitMQ Management will be on http://localhost:15672"
	@echo "MailHog SMTP Web UI will be on http://localhost:8025"
	# Standard concurrent runner
	npx concurrently "make dev-backend" "make dev-frontend"

# Build production artifacts
build:
	cd backend && mvn clean package -DskipTests
	cd frontend && npm run build

# Clean up build artifacts
clean:
	cd backend && mvn clean
	rm -rf frontend/.next frontend/out frontend/node_modules backend/target
