Professional Node.js + TypeScript + MySQL REST API BoilerplateA production-ready, modular REST API boilerplate built with Node.js, Express, TypeScript, TypeORM, and MySQL. Designed as a scalable architectural foundation for enterprise and full-stack applications, this template comes pre-configured with centralized error handling, Joi request validation, structured Winston logging, security hardening, database migrations, seeders, and a complete User CRUD vertical slice.Table of ContentsFeaturesTech StackProject StructureGetting StartedPrerequisitesInstallation & SetupEnvironment VariablesDatabase Migrations & SeedersRunning the ApplicationAPI Endpoints DocumentationHealth CheckUsers ResourceStandard Response & Error FormatsLab Reflection QuestionsFeaturesTypeScript-First Architecture: Strict type checking, decorator metadata support, and clean separation of concerns across routes, controllers, services, DTOs, and entities.Environment Validation: Fails fast on startup using Joi if required environment variables are missing or malformed.Centralized Error Handling: Custom AppError class hierarchy (NotFoundError, ValidationError, ConflictError, UnauthorizedError, ForbiddenError, InternalError), an asyncHandler wrapper, and global Express error middleware.Declarative Request Validation: Reusable middleware powered by Joi to validate, sanitize, coerce, and strip unknown fields from body, params, and query inputs.Structured Logging & Request Tracing: Winston logger configured with JSON file rotation (logs/combined.log and logs/error.log), colorized console output in development, and per-request X-Request-ID correlation tracking.Security Hardening: Configured out of the box with Helmet HTTP headers, strict CORS policy, express-rate-limit, JSON payload size limits (10kb), and bcrypt password hashing.Production Database Workflow: TypeORM with synchronize: false, version-controlled schema migrations, connection pooling, and idempotent database seeders.Graceful Shutdown: Handles SIGTERM and SIGINT signals to close active HTTP connections and database pools cleanly.Tech StackRuntime & Language: Node.js (v20+ / v22 LTS), TypeScriptWeb Framework: ExpressORM & Database: TypeORM, MySQL (mysql2)Validation: JoiLogging: WinstonSecurity & Utilities: Helmet, CORS, Express Rate Limit, Bcrypt, UUID, DotenvProject Structureprofessional-boilerplate/
├── logs/                          # Rotating log files (combined.log, error.log)
├── src/
│   ├── config/
│   │   ├── data-source.ts         # TypeORM DataSource & connection pool config
│   │   └── env.ts                 # Dotenv loader & Joi environment validation
│   ├── controllers/
│   │   └── userController.ts      # HTTP request/response handlers for Users
│   ├── dto/
│   │   └── user.dto.ts            # Joi schemas for body, params, and query validation
│   ├── entities/
│   │   └── User.ts                # TypeORM User entity definition
│   ├── middleware/
│   │   ├── errorHandler.ts        # Global error & 404 route handlers
│   │   ├── requestLogger.ts       # HTTP request/response logger with request IDs
│   │   ├── security.ts            # Helmet, CORS, and rate-limiter configurations
│   │   └── validate.ts            # Generic Joi validation middleware
│   ├── migrations/                # TypeORM database migrations
│   ├── routes/
│   │   ├── healthRoutes.ts        # Service & database health check endpoint
│   │   └── userRoutes.ts          # User CRUD routes
│   ├── seeds/
│   │   ├── runSeeds.ts            # Seeder runner script
│   │   └── userSeeder.ts          # Initial admin & test user seed data
│   ├── services/
│   │   └── userService.ts         # Business logic & repository operations
│   ├── utils/
│   │   ├── asyncHandler.ts        # Async route error forwarding wrapper
│   │   ├── errors.ts              # Custom operational & system error classes
│   │   ├── logger.ts              # Winston logger & child context factory
│   │   └── response.ts            # Standardized JSON & pagination response helpers
│   └── index.ts                   # Application entry point & graceful shutdown
├── tests/
│   ├── integration/               # Integration test suite
│   └── unit/                      # Unit test suite
├── .env.example                   # Environment variable template
├── .gitignore
├── package.json
└── tsconfig.json
Getting StartedPrerequisitesEnsure the following tools are installed on your machine:Node.js (v20.x or v22.x LTS)npm (v10+)MySQL Server (v8.0+)Postman or Insomnia (optional, for testing endpoints)Installation & SetupClone the repository:git clone https://github.com/YOUR_USERNAME/professional-boilerplate.git
cd professional-boilerplate
Install dependencies:npm install
Create the logs directory (if not present):mkdir -p logs
Configure environment variables:
Copy .env.example to .env and fill in your local MySQL credentials:cp .env.example .env
Create the MySQL database:
Connect to your MySQL server (via CLI or MySQL Workbench) and run:CREATE DATABASE boilerplate_db;
Run database migrations and seeders:npm run migration:run
npm run seed
Start the development server:npm run dev
The API will be available at http://localhost:3000.Environment VariablesAll environment variables are validated at startup in src/config/env.ts. If a required variable is missing or invalid, the server will refuse to start with a descriptive error.VariableRequiredDefaultDescriptionNODE_ENVNodevelopmentApplication environment (development, production, or test).PORTNo3000Port number on which the Express HTTP server listens.DB_HOSTYes—Hostname or IP address of the MySQL database server.DB_PORTNo3306Port number of the MySQL database server.DB_USERNAMEYes—MySQL database user with privileges on DB_DATABASE.DB_PASSWORDYes—Password for the specified MySQL user.DB_DATABASEYes—Target MySQL database name (e.g., boilerplate_db).FRONTEND_URLNohttp://localhost:4200Allowed origin for CORS requests.Database Migrations & SeedersThis project sets synchronize: false in TypeORM so schema changes are always explicit, reviewable, and reversible.Migration CommandsGenerate a new migration (after modifying an entity in src/entities/):npm run migration:generate -- -n MigrationName
Apply all pending migrations:npm run migration:run
Revert the most recently executed migration:npm run migration:revert
Seeding Initial DataPopulate the database with default users (admin@example.com and test@example.com):npm run seed
Note: The seeder is idempotent—running it multiple times will skip users whose email addresses already exist in the database.Running the ApplicationScriptCommandDescriptionDevelopmentnpm run devRuns the server with ts-node-dev and automatic reload on file changes.Buildnpm run buildCompiles TypeScript source files from src/ into JavaScript in dist/.Productionnpm startRuns the compiled application from dist/index.js.API Endpoints DocumentationHealth CheckGET /healthVerifies that the HTTP server is running and can execute queries against MySQL.Success Response (200 OK):{
  "success": true,
  "data": {
    "uptime": 42.15,
    "status": "OK",
    "timestamp": 1730000000000,
    "database": "connected"
  }
}
Failure Response (503 Service Unavailable): Returned if the database connection fails.Users ResourceBase URL: /api/usersMethodEndpointDescriptionBody / Query / ParamsGET/api/usersRetrieve a paginated list of usersQuery: page, limit, sort, orderGET/api/users/:idRetrieve a single user by IDParams: id (positive integer)POST/api/usersCreate a new userBody: name, email, password, age?PUT/api/users/:idUpdate an existing userParams: id; Body: name?, email?, age?, isActive?DELETE/api/users/:idDelete a user by IDParams: id (positive integer)1. Get All Users (GET /api/users)Query Parameters:page (integer, min 1, default 1)limit (integer, 1–100, default 10)sort (createdAt | updatedAt | name | email, default createdAt)order (ASC | DESC, default DESC)Response (200 OK):{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "isActive": true,
      "age": null,
      "createdAt": "2026-11-23T01:30:00.000Z",
      "updatedAt": "2026-11-23T01:30:00.000Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
2. Get User by ID (GET /api/users/:id)Response (200 OK): Returns the user object wrapped in { "success": true, "data": { ... } }.Error (404 Not Found): Returned if no user exists with the given id.3. Create User (POST /api/users)Request Body:{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "age": 30
}
name: String, 2–100 characters (required)email: Valid email address, unique (required)password: String, 8–50 characters, must contain at least one letter and one number (required)age: Integer, 13–120 (optional)Response (201 Created):{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 3,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "age": 30,
    "createdAt": "2026-11-23T01:35:00.000Z",
    "updatedAt": "2026-11-23T01:35:00.000Z"
  }
}
Errors: 400 Bad Request (validation failure) or 409 Conflict (duplicate email).4. Update User (PUT /api/users/:id)Request Body (at least one field required):{
  "name": "Updated Name",
  "isActive": false
}
Response (200 OK): Returns the updated user with "message": "User updated successfully".Errors: 400 Bad Request, 404 Not Found, or 409 Conflict.5. Delete User (DELETE /api/users/:id)Response (204 No Content): Empty response body on successful deletion.Error (404 Not Found): Returned if the user does not exist.Standard Response & Error FormatsAll error responses follow a consistent JSON envelope:{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid email address",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address",
        "type": "string.email"
      }
    ]
  }
}
HTTP StatusError CodeDescription400VALIDATION_ERRORRequest body, params, or query failed Joi schema validation.400INVALID_JSONMalformed JSON payload in the request body.400DATABASE_ERRORDatabase query or constraint failure.401UNAUTHORIZEDMissing or invalid authentication credentials.403FORBIDDENAuthenticated user lacks permission for the requested action.404NOT_FOUND / ROUTE_NOT_FOUNDRequested entity or API endpoint does not exist.409CONFLICTResource conflict (such as a duplicate unique email address).429RATE_LIMIT_EXCEEDEDClient exceeded the rate limit (100 requests per 15 minutes).500INTERNAL_ERRORUnexpected server-side error.Lab Reflection Questions1. What was the most challenging part of building this boilerplate? How did you overcome it?The most challenging part was getting all the cross-cutting layers—TypeORM decorator metadata, Express 5 request handling, Joi validation, and Winston custom formatting—to integrate cleanly under strict TypeScript rules. Specifically, Express 5 defines req.query as a getter-only property on IncomingMessage, so reassigning req[source] = value in the validation middleware threw a runtime TypeError on GET requests with query parameters, while TypeORM's strict FindOptionsSelect typing flagged array-based select options. I overcame both by reading the stack traces carefully, mutating req.query in place (clearing old keys and using Object.assign) so unknown query parameters are still stripped safely, and converting TypeORM select options to typed boolean maps.2. How does this boilerplate differ from your Midterm project? What specific improvements did you make?In the Midterm project, routes, validation checks, database calls, and error responses were tightly coupled inside controllers with ad-hoc try-catch blocks and console.log statements. This boilerplate introduces a true layered architecture (Routes -> Middleware -> Controller -> Service -> Repository/Entity) along with production operational safeguards: fail-fast environment validation via Joi, a typed AppError hierarchy, standardized response envelopes, request ID correlation in Winston logs, Helmet/CORS/rate-limiting security middleware, and version-controlled TypeORM migrations instead of auto-syncing schemas.3. Why is centralized error handling better than try-catch in every controller?Repeating try-catch blocks in every controller clutters business logic, leads to inconsistent HTTP status codes and JSON error shapes across endpoints, and makes it easy to accidentally leak raw database errors or stack traces in production. With asyncHandler forwarding rejected promises to a single errorHandler middleware, controllers stay focused purely on the happy path while all operational and unexpected errors are logged uniformly and formatted into one predictable contract for frontend clients.4. How does request validation with Joi improve security and code quality?From a security standpoint, Joi acts as a strict gatekeeper before data ever reaches services or SQL queries—enforcing types, lengths, formats, and password complexity while stripUnknown: true prevents mass-assignment vulnerabilities (such as a client injecting isAdmin: true into a payload). From a code quality standpoint, declarative schemas in src/dto/ serve as living documentation of expected inputs, coerce types automatically (like query string numbers), and eliminate repetitive defensive if (!req.body.email) boilerplate inside controllers and services.5. What's the difference between synchronize: true and migrations? Why are migrations essential for production?synchronize: true tells TypeORM to automatically inspect entities on startup and alter database tables to match them without review. While convenient during early prototyping, it can silently drop columns or tables—causing permanent data loss—if an entity property is renamed or removed. Migrations generate explicit, timestamped SQL/TypeScript scripts (up and down) that can be code-reviewed, tested in staging, tracked in Git, executed predictably during CI/CD deployments, and rolled back safely if an issue occurs in production.6. How does structured logging (Winston) help in production debugging compared to console.log?console.log writes unstructured plain text to standard output with no severity levels, timestamps, service context, or file persistence, making it nearly impossible to search or filter under high traffic. Winston outputs structured JSON logs enriched with timestamps, log levels (info, warn, error), service context (UserService, HTTP), error stack traces, and unique X-Request-ID correlation IDs, while automatically routing errors to logs/error.log and rotating files so disk space is never exhausted.7. If you had to add a new feature (e.g., Product CRUD), how would you use this boilerplate? What would you need to add?Because the boilerplate follows a modular vertical-slice pattern, adding Product CRUD requires zero changes to the core infrastructure. I would:Define the Product entity in src/entities/Product.ts and register it in src/config/data-source.ts.Generate and run a migration (npm run migration:generate -- -n AddProductsTable and npm run migration:run).Create Joi schemas (createProductSchema, updateProductSchema) in src/dto/product.dto.ts.Implement data access and business rules in src/services/productService.ts using existing AppError classes (NotFoundError, ConflictError).Create src/controllers/productController.ts using sendSuccess, sendCreated, sendPaginated, and sendNoContent.Wire up src/routes/productRoutes.ts with validate and asyncHandler, then mount /api/products in src/index.ts.8. What additional features would you add to make this boilerplate even more production-ready?To prepare this boilerplate for full production deployment, I would add:Authentication & RBAC: JWT access/refresh token authentication middleware and role-based authorization guards (admin vs. user).Automated Testing: Unit tests for services and integration tests (using Jest/Vitest and Supertest) covering all validation, error, and CRUD edge cases.API Documentation: OpenAPI/Swagger UI generated from the Joi schemas so frontend developers can explore and test endpoints interactively.Containerization & CI/CD: A multi-stage Dockerfile, docker-compose.yml (bundling Node + MySQL), and a GitHub Actions workflow to run linting, type-checking, tests, and migrations automatically on pull requests.