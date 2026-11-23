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









Professional Node.js + TypeScript + MySQL REST API Boilerplate (with JWT Authentication)A production-ready, modular REST API boilerplate built with Node.js, Express, TypeScript, TypeORM, and MySQL, now equipped with JWT (JSON Web Token) authentication and route protection. Designed as a scalable architectural foundation for full-stack and enterprise applications, this project combines centralized error handling, Joi request validation, structured Winston logging, security middleware, database migrations, seeders, user management, and token-based authentication.Table of ContentsFeaturesTech StackProject StructureGetting StartedPrerequisitesInstallation & SetupEnvironment VariablesDatabase Migrations & SeedersRunning the ApplicationAuthentication & API Endpoints DocumentationAuthentication FlowHow to Get a Token (Login Endpoint)How to Use the Token (Authorization Header)Public vs. Protected EndpointsEndpoint Reference & ExamplesStandard Error ResponsesLab Reflection QuestionsFeaturesJWT Authentication & Route Protection: Login endpoint (POST /api/auth/login), current-user profile endpoint (GET /api/auth/me), HMAC-SHA256 signed JWT tokens, and authMiddleware to guard protected resources.TypeScript-First Architecture: Strict type checking, decorator metadata support, and clean separation of concerns across routes, middleware, controllers, services, DTOs, and entities.Environment Validation: Fails fast on startup using Joi if required variables (including JWT_SECRET) are missing or invalid.Centralized Error Handling: Custom AppError classes (NotFoundError, ValidationError, ConflictError, UnauthorizedError, ForbiddenError, InternalError), asyncHandler, and global Express error middleware.Declarative Request Validation: Reusable Joi middleware to validate, coerce, and strip unknown fields from body, params, and query inputs.Structured Logging & Request Tracing: Winston logger with JSON file rotation (logs/combined.log and logs/error.log), colorized console output in development, and per-request X-Request-ID tracking.Security Hardening: Configured with Helmet, strict CORS, express-rate-limit, JSON payload size limits (10kb), and bcrypt password hashing.Production Database Workflow: TypeORM with synchronize: false, version-controlled migrations, connection pooling, and idempotent seeders.Tech StackRuntime & Language: Node.js (v20+ / v22 LTS), TypeScriptWeb Framework: ExpressORM & Database: TypeORM, MySQL (mysql2)Authentication: JSON Web Tokens (jsonwebtoken), bcryptValidation: JoiLogging: WinstonSecurity & Utilities: Helmet, CORS, Express Rate Limit, UUID, DotenvProject Structureprofessional-boilerplate/
├── logs/                          # Rotating log files (combined.log, error.log)
├── src/
│   ├── config/
│   │   ├── data-source.ts         # TypeORM DataSource & connection pool config
│   │   └── env.ts                 # Dotenv loader & Joi environment validation (incl. JWT)
│   ├── controllers/
│   │   ├── authController.ts      # Login and current-user (/me) handlers
│   │   └── userController.ts      # HTTP request/response handlers for Users
│   ├── dto/
│   │   ├── auth.dto.ts            # Joi login validation schema
│   │   └── user.dto.ts            # Joi schemas for user body, params, and query
│   ├── entities/
│   │   └── User.ts                # TypeORM User entity definition
│   ├── middleware/
│   │   ├── auth.ts                # JWT extraction, verification & req.user attachment
│   │   ├── errorHandler.ts        # Global error & 404 route handlers
│   │   ├── requestLogger.ts       # HTTP request/response logger with request IDs
│   │   ├── security.ts            # Helmet, CORS, and rate-limiter configurations
│   │   └── validate.ts            # Generic Joi validation middleware
│   ├── migrations/                # TypeORM database migrations
│   ├── routes/
│   │   ├── authRoutes.ts          # Authentication routes (/login, /me)
│   │   ├── healthRoutes.ts        # Service & database health check endpoint
│   │   └── userRoutes.ts          # Protected User CRUD routes
│   ├── seeds/
│   │   ├── runSeeds.ts            # Seeder runner script
│   │   └── userSeeder.ts          # Initial admin & test user seed data
│   ├── services/
│   │   ├── authService.ts         # Login, bcrypt check, JWT sign/verify & user lookup
│   │   └── userService.ts         # Business logic & repository operations for Users
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
Getting StartedPrerequisitesNode.js (v20.x or v22.x LTS)npm (v10+)MySQL Server (v8.0+)Postman or Insomnia (optional, for testing endpoints)Installation & SetupClone the repository:git clone https://github.com/Maris0519/professional-boilerplate.git
cd professional-boilerplate
Install dependencies:npm install
Create the logs directory (if not present):mkdir -p logs
Generate a secure JWT secret:node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
Configure environment variables:
Copy .env.example to .env and set your MySQL credentials and generated JWT_SECRET:cp .env.example .env
Create the MySQL database:CREATE DATABASE boilerplate_db;
Run database migrations and seeders:npm run migration:run
npm run seed
Start the development server:npm run dev
The API will be available at http://localhost:3000.Environment VariablesAll environment variables are validated at startup in src/config/env.ts. If a required variable is missing or does not meet validation rules, the server fails fast on startup.VariableRequiredDefaultDescriptionNODE_ENVNodevelopmentApplication environment (development, production, or test).PORTNo3000Port number on which the Express HTTP server listens.DB_HOSTYes—Hostname or IP address of the MySQL database server.DB_PORTNo3306Port number of the MySQL database server.DB_USERNAMEYes—MySQL database user with privileges on DB_DATABASE.DB_PASSWORDYes—Password for the specified MySQL user.DB_DATABASEYes—Target MySQL database name (e.g., boilerplate_db).FRONTEND_URLNohttp://localhost:4200Allowed origin for CORS requests.JWT_SECRETYes—Secret key (minimum 32 characters) used to sign and verify JWT tokens.JWT_EXPIRES_INNo24hJWT token lifetime (e.g., 24h, 7d, 1h).Database Migrations & SeedersThis project sets synchronize: false in TypeORM so schema changes are explicit, reviewable, and reversible.Migration Commands# Generate a new migration after modifying entities
npm run migration:generate -- -n MigrationName

# Run all pending migrations
npm run migration:run

# Revert the most recent migration
npm run migration:revert
Seeding Initial Datanpm run seed
The seeder is idempotent and creates default accounts (admin@example.com and test@example.com) if they do not already exist.Running the ApplicationScriptCommandDescriptionDevelopmentnpm run devStarts the server with ts-node-dev and hot-reloading.Buildnpm run buildCompiles TypeScript from src/ into JavaScript in dist/.Productionnpm startRuns the compiled application from dist/index.js.Authentication & API Endpoints DocumentationAuthentication FlowClient submits credentials: The client sends a POST /api/auth/login request with a valid email and password.Credential & account verification: AuthService.login() validates the payload with loginSchema, queries the User record (explicitly selecting password and isActive), checks that the account is active, and verifies the plaintext password against the stored bcrypt hash.Token generation: Upon success, the server signs a JWT containing { userId, email } using config.jwt.secret and config.jwt.expiresIn, returning the token and safe user profile data.Protected requests & middleware validation: For protected endpoints, the client includes Authorization: Bearer <token>. authMiddleware extracts the Bearer token, calls AuthService.verifyToken() to verify the signature and expiration, attaches the decoded payload to req.user, and passes control to the next handler (or throws UnauthorizedError / 401 if missing, malformed, expired, or invalid).How to Get a Token (Login Endpoint)Send a POST request to http://localhost:3000/api/auth/login with a JSON body containing email and password:POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123"
}
Response (200 OK):{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt-token>",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "Test User"
    }
  }
}
How to Use the Token (Authorization Header)Include the JWT token in the Authorization HTTP header using the Bearer scheme on every protected request:GET /api/users
Authorization: Bearer <your-jwt-token>
If the header is omitted, not prefixed with Bearer , malformed, expired, or signed with a different secret, the API responds with 401 Unauthorized (UNAUTHORIZED).Public vs. Protected EndpointsMethodEndpointAccess LevelAuthentication RequiredDescriptionGET/healthPublicNoChecks API uptime and MySQL database connectivity.POST/api/auth/loginPublicNoAuthenticates user credentials and issues a JWT token.GET/api/auth/meProtectedYes (Bearer <token>)Validates token and returns the authenticated user's profile.GET/api/usersProtectedYes (Bearer <token>)Returns a paginated list of users (page, limit, sort, order).GET/api/users/:idProtectedYes (Bearer <token>)Returns a single user by numeric ID.POST/api/usersProtectedYes (Bearer <token>)Creates a new user with a hashed password.PUT/api/users/:idProtectedYes (Bearer <token>)Updates an existing user's fields.DELETE/api/users/:idProtectedYes (Bearer <token>)Deletes a user by numeric ID (204 No Content).Endpoint Reference & ExamplesPOST /api/auth/login (Public)Body: email (valid email, required), password (string, 8–50 chars, required).Responses: 200 OK with { token, user }, 400 Bad Request on validation error, or 401 Unauthorized on invalid credentials or inactive account.GET /api/auth/me (Protected)Headers: Authorization: Bearer <token>Responses: 200 OK with { id, email, name, isActive, createdAt } or 401 Unauthorized.GET /api/users (Protected)Headers: Authorization: Bearer <token>Query Params: page (default 1), limit (1–100, default 10), sort (createdAt | updatedAt | name | email, default createdAt), order (ASC | DESC, default DESC).Response (200 OK): Paginated data array and meta pagination summary.GET /api/users/:id (Protected)Headers: Authorization: Bearer <token>Params: id (positive integer).Responses: 200 OK with user data or 404 Not Found.POST /api/users (Protected)Headers: Authorization: Bearer <token>Body: name (2–100 chars, required), email (valid email, required), password (8–50 chars with at least one letter and one number, required), age (integer 13–120, optional).Responses: 201 Created, 400 Bad Request (validation), or 409 Conflict (duplicate email).PUT /api/users/:id (Protected)Headers: Authorization: Bearer <token>Params: id (positive integer).Body: At least one of name, email, age, isActive.Responses: 200 OK, 400 Bad Request, 404 Not Found, or 409 Conflict.DELETE /api/users/:id (Protected)Headers: Authorization: Bearer <token>Params: id (positive integer).Responses: 204 No Content or 404 Not Found.Standard Error Responses{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "No token provided"
  }
}
Common error codes include VALIDATION_ERROR (400), INVALID_JSON (400), DATABASE_ERROR (400), UNAUTHORIZED (401), FORBIDDEN (403), NOT_FOUND / ROUTE_NOT_FOUND (404), CONFLICT (409), RATE_LIMIT_EXCEEDED (429), and INTERNAL_ERROR (500).Lab Reflection Questions1. What is the difference between authentication and authorization? Give a real-world example of each.Authentication verifies who a user is (confirming identity), whereas authorization determines what that verified user is allowed to do or access (enforcing permissions). In real-world terms, showing your government ID or scanning your employee badge at a building entrance is authentication, while having a badge that unlocks only the engineering lab rather than the executive vault is authorization. In this API, POST /api/auth/login and authMiddleware handle authentication via JWT, while checking whether a user has permission to manage other accounts is authorization.2. Why is JWT considered "stateless" and how does that benefit scalability?A JWT is considered stateless because the server does not need to store session state in memory or query a session store on every incoming request; all required identity claims (userId, email) live inside the signed token itself and can be verified cryptographically using JWT_SECRET. This benefits horizontal scalability because any API instance behind a load balancer can validate a token independently without shared session replication or sticky sessions, reducing server memory overhead and database round-trips on authenticated requests.3. What are the three parts of a JWT token and what does each part do?A JWT consists of three Base64URL-encoded parts separated by dots (header.payload.signature):Header: Identifies the token type (JWT) and the signing algorithm (such as HS256).Payload: Contains the claims (such as userId, email, issued-at iat, and expiration exp) that describe the authenticated subject and token metadata.Signature: Created by hashing the encoded header and payload with the secret key (JWT_SECRET) and algorithm, allowing the server to detect if the header or payload has been tampered with.4. Why should you never put sensitive data (like passwords) in the JWT payload?JWT payload segments are Base64URL-encoded, not encrypted—anyone who possesses the token can decode and read the payload immediately. Putting sensitive secrets like passwords, API keys, or personal identification numbers in the payload exposes them whenever a token is inspected or leaked, and tokens also travel across headers and client storage where exposure risk is higher. Only non-secret identifier claims needed for routing and identity lookup should be included.5. How does bcrypt protect user passwords? What is the purpose of the "salt" and "rounds"?bcrypt hashes passwords using a slow, adaptive cryptographic algorithm designed to resist brute-force and GPU cracking attacks. A salt is a unique random value generated per password so identical passwords produce completely different hashes, defeating precomputed lookup/rainbow tables. Rounds (the cost factor, such as 10 in bcrypt.hash(password, 10)) control how many key-stretching iterations ($2^{\text{rounds}}$) are performed, letting you increase hashing cost as hardware becomes faster while keeping login latency acceptable.6. What happens if someone steals a JWT token? How can you mitigate this risk?If an attacker steals a valid JWT before it expires, they can impersonate the user by sending Authorization: Bearer <token> to protected endpoints until the token expires. You can mitigate this risk by keeping access token expiration relatively short (JWT_EXPIRES_IN), enforcing HTTPS everywhere, avoiding insecure storage where XSS can read tokens, checking isActive / user existence on sensitive lookups, and supporting token revocation/refresh strategies when needed.7. Why is it important to use HTTPS when transmitting JWT tokens?Over unencrypted HTTP, network intermediaries can intercept traffic and capture the Authorization: Bearer <token> header in plain text, allowing immediate session hijacking. HTTPS encrypts the entire transport channel using TLS, protecting both login credentials (POST /api/auth/login) and subsequent Bearer tokens from eavesdropping and man-in-the-middle tampering in transit.8. What is the difference between a short-lived access token and a long-lived refresh token? When would you use each?A short-lived access token is sent with regular API requests to access protected resources and expires quickly (e.g., minutes to a few hours) to limit the window of misuse if leaked. A long-lived refresh token has a longer lifespan (e.g., days or weeks) and is used solely to obtain a new access token without forcing the user to re-enter credentials constantly. Use access tokens for routine API authorization and refresh tokens for seamless session renewal and revocation control.9. How does the auth middleware know which user is making the request?authMiddleware reads the Authorization header, strips the Bearer  prefix to isolate the token string, and calls AuthService.verifyToken(token). jwt.verify() validates the signature and expiration using config.jwt.secret and returns the decoded TokenPayload ({ userId, email }), which the middleware attaches to req.user so downstream controllers and services know which authenticated user made the request.10. If you had to implement role-based authorization (e.g., admin vs. regular user), how would you modify your current setup?I would add a role column (such as 'USER' | 'ADMIN', defaulting to 'USER') to the User entity and generate a database migration for it. Then I would include role in TokenPayload and req.user, create a reusable role-guard middleware factory (for example, authorizeRoles('ADMIN')) that runs after authMiddleware and throws ForbiddenError (403) if req.user.role is not permitted, and attach that guard to admin-only routes.