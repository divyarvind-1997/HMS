When you write ASP.NET Code Web Pages and API's, always use below instructions.

## ASP.NET Coding Best Practices

### 1. Project Structure & Organization
- Use clear folder structure: `Controllers/`, `Models/`, `Services/`, `Views/`, `DTOs/`, `Repositories/`
- Keep concerns separated (business logic, data access, presentation)
- Use namespaces consistently (e.g., `HMS.Login.Services`, `HMS.Login.Models`)
- One public class per file (except related types in the same domain)

### 2. Naming Conventions
- **Classes & Interfaces**: PascalCase (e.g., `UserService`, `IUserRepository`)
- **Methods & Properties**: PascalCase (e.g., `GetUserById()`, `IsActive`)
- **Parameters & Local Variables**: camelCase (e.g., `userId`, `userName`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_LOGIN_ATTEMPTS`, `DEFAULT_TIMEOUT`)
- **Private fields**: camelCase with underscore prefix (e.g., `_userRepository`)
- **Async methods**: End with `Async` (e.g., `GetUserByIdAsync()`)

### 3. API Design
- Use RESTful conventions (GET, POST, PUT, DELETE, PATCH)
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Use DTOs (Data Transfer Objects) for request/response models
- Include API versioning (e.g., `/api/v1/users`)
- Add consistent error response format:
  ```json
  {
    "success": false,
    "message": "Error description",
    "errors": { "fieldName": ["error message"] }
  }
  ```
- Use pagination for list endpoints (limit, offset/page)

### 4. Security
- Validate all input (both client and server-side)
- Use HTTPS/TLS for all communications
- Never hardcode sensitive data; use configuration/secrets management
- Implement proper authentication (JWT, OAuth2)
- Use authorization attributes (`[Authorize]`, `[AllowAnonymous]`)
- Sanitize data to prevent SQL injection and XSS
- Implement CORS policy appropriately
- Hash passwords using strong algorithms (bcrypt, Argon2)
- Add rate limiting for API endpoints
- Use parameterized queries with Entity Framework

### 5. Dependency Injection
- Register services in `Program.cs` (or `Startup.cs` for older projects)
- Use interface-based dependency injection
- Register with appropriate lifetimes: `AddSingleton`, `AddScoped`, `AddTransient`
- Avoid Service Locator pattern

### 6. Error Handling & Logging
- Use try-catch for specific exceptions, not bare catches
- Log exceptions with full context (stack trace, user info, etc.)
- Create custom exception classes for domain-specific errors
- Return meaningful error messages to clients
- Use structured logging (e.g., Serilog)
- Log levels: Debug, Information, Warning, Error, Critical

### 7. Asynchronous Programming
- Use `async/await` for I/O operations (database, HTTP calls)
- Avoid `async void` except for event handlers
- Use `Task<T>` for return types
- Configure `ConfigureAwait(false)` in library code
- Use `CancellationToken` for long-running operations

### 8. Database Access
- Use Entity Framework Core with async methods
- Implement Repository pattern for data access
- Use migrations for schema changes
- Validate foreign keys and constraints
- Avoid N+1 query problems (use `Include()` for eager loading)
- Use indexes on frequently queried columns
- Implement soft deletes when appropriate

### 9. Code Quality
- Follow SOLID principles
- Use design patterns appropriately (Factory, Singleton, Strategy, etc.)
- Keep methods focused (single responsibility)
- Limit method parameters (max 3-4)
- Use meaningful variable names
- Add XML documentation comments for public members
- Keep cyclomatic complexity low

### 10. Testing
- Write unit tests for business logic
- Use mocking/stubbing for external dependencies
- Test both success and failure scenarios
- Aim for >80% code coverage in critical paths
- Use integration tests for API endpoints
- Test with realistic data

### 11. Configuration
- Use `appsettings.json` for configuration
- Environment-specific settings: `appsettings.Development.json`, `appsettings.Production.json`
- Never commit sensitive data (connection strings, API keys)
- Use User Secrets for development
- Use configuration providers for different environments

### 12. Performance
- Cache frequently accessed data (Redis, in-memory)
- Use pagination for large datasets
- Avoid N+1 queries
- Monitor database query performance
- Use indexes on foreign keys and search columns
- Implement connection pooling
- Use async/await to avoid blocking threads

### 13. Documentation
- Add XML comments to public APIs
- Document complex business logic
- Keep README updated with setup instructions
- Document environment variables needed
- Provide API documentation (Swagger/OpenAPI)

### 14. Version Control
- Use meaningful commit messages
- Create feature branches for new functionality
- Use pull requests for code review
- Don't commit `bin/`, `obj/`, `appsettings.*.json` (secrets)