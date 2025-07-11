# 🚀 NLW Server AI

A modern, high-performance REST API server built with cutting-edge technologies for the NLW (Next Level Week) AI project. This server provides a robust backend infrastructure with real-time capabilities, type-safe APIs, and scalable database architecture.

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **TypeScript** - Type-safe JavaScript development
- **Fastify** - High-performance web framework
- **Drizzle ORM** - Type-safe SQL ORM with excellent TypeScript support
- **PostgreSQL** - Robust relational database with pgvector extension
- **Zod** - TypeScript-first schema validation

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **Biome** - Fast formatter and linter
- **Docker & Docker Compose** - Containerized development environment
- **Drizzle Kit** - Database migration and seeding tools

### Key Features
- ⚡ **High Performance** - Built with Fastify for optimal speed
- 🔒 **Type Safety** - Full TypeScript coverage with Zod validation
- 🗄️ **Modern Database** - PostgreSQL with pgvector for AI/ML capabilities
- 🐳 **Containerized** - Easy local development with Docker
- 📝 **API Documentation** - Built-in request/response validation
- 🔄 **Real-time Ready** - CORS configured for frontend integration

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v10.12.4 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nlw-server-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nlw-server-ai
```

### 4. Start the Database

```bash
docker-compose up -d
```

This will start a PostgreSQL database with pgvector extension on port 5432.

### 5. Run Database Migrations

```bash
pnpm drizzle-kit push
```

### 6. Seed the Database (Optional)

```bash
pnpm seed
```

### 7. Start the Development Server

```bash
pnpm dev
```

The server will be available at `http://localhost:3333`

## 📁 Project Structure

```
nlw-server-ai/
├── src/
│   ├── db/
│   │   ├── connection.ts      # Database connection setup
│   │   ├── migrations/        # Database migration files
│   │   ├── schema/
│   │   │   ├── index.ts       # Schema exports
│   │   │   └── rooms.ts       # Rooms table schema
│   │   └── seed.ts           # Database seeding
│   ├── http/
│   │   └── routes/
│   │       └── get-rooms.ts   # Rooms API endpoint
│   ├── env.ts                # Environment validation
│   └── server.ts             # Main server file
├── docker/
│   └── setup.sql             # Database initialization
├── docker-compose.yml        # Docker services configuration
├── drizzle.config.ts         # Drizzle ORM configuration
├── package.json              # Project dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm start` | Start production server |
| `pnpm seed` | Seed the database with initial data |

## 🌐 API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Rooms
- **GET** `/rooms` - Retrieve all rooms

### Testing API Endpoints

You can use the provided `client.http` file to test the API endpoints:

```bash
# Using VS Code REST Client extension or similar
# Open client.http and click "Send Request"
```

Or use curl:

```bash
# Health check
curl http://localhost:3333/health

# Get rooms
curl http://localhost:3333/rooms
```

## 🗄️ Database

The project uses PostgreSQL with the pgvector extension, which provides:

- **Vector similarity search** - Perfect for AI/ML applications
- **Scalable architecture** - Handles complex queries efficiently
- **Type-safe operations** - Drizzle ORM ensures type safety

### Database Schema

#### Rooms Table
- `id` (UUID) - Primary key
- `name` (TEXT) - Room name
- `description` (TEXT) - Room description
- `created_at` (TIMESTAMP) - Creation timestamp

## 🔧 Development

### Code Quality

The project uses **Biome** for code formatting and linting:

```bash
# Format code
pnpm biome format --write .

# Lint code
pnpm biome lint .
```

### Database Migrations

```bash
# Generate migration
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit push

# View database
pnpm drizzle-kit studio
```

## 🐳 Docker

The project includes Docker configuration for easy development:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3333` |
| `DATABASE_URL` | PostgreSQL connection string | Required |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your environment details and error logs

---

**Built with ❤️ for the NLW AI community** 