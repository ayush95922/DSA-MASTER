# 🌌 DSAverse

**The most complete platform for DSA learning and placement preparation.**

DSAverse takes students from zero DSA knowledge to placement-ready — covering structured learning, guided practice, company-specific preparation, AI-assisted revision, and long-term retention.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, TailwindCSS, ShadCN/ui |
| Backend | Spring Boot 3.3, Java 21 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Search | Elasticsearch 8 |
| Queue | RabbitMQ 3 |
| DevOps | Docker, Kubernetes, GitHub Actions |

## Quick Start

### Prerequisites
- Node.js 20+
- Java 21+
- Docker & Docker Compose
- Maven 3.9+

### 0. Configure AI Service Key (Optional but Required for AI Features)
The AI Placement Coach, Quizzes, and Revision flashcards rely on Google Gemini. To activate these:
1. Create a copy of `.env.example` named `.env` in the root project directory:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set your key:
   ```env
   GEMINI_API_KEY=your_google_studio_api_key_here
   ```
3. The backend will automatically validate and load this key during startup. Alternatively, you can run the backend by passing the key inline:
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dapp.gemini.api-key=your_api_key
   ```

### 1. Start Infrastructure
```bash
docker compose up -d
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access Points
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| MailHog | http://localhost:8025 |
| RabbitMQ | http://localhost:15672 |

## Project Structure

```
dsaverse/
├── frontend/          # Next.js 15 application
├── backend/           # Spring Boot application
├── infra/             # Docker, Kubernetes, scripts
└── .github/           # CI/CD workflows
```

## License

Proprietary — All rights reserved.
