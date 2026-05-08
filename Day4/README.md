# Day 4: Database Testing and Framework Creation

## Agenda
- Database Testing Concepts
- SQL Queries in Tests
- Setting up Test Database
- Integrating BDD, POM, API, and DB Testing
- Creating a Complete Test Framework
- Best Practices for Framework Architecture
- Real-time Example: End-to-End Framework for MakeMyTrip

## Database Testing
Testing database operations to ensure data integrity.

### Types of DB Tests:
- Data validation
- CRUD operations
- Constraints and triggers
- Performance queries

### Tools:
- SQLite for testing
- Direct SQL queries
- ORM integration

## Framework Architecture
A good test framework should have:
- **Page Objects**: For UI interactions
- **API Clients**: For API testing
- **DB Helpers**: For database operations
- **Test Data Management**: Fixtures and factories
- **Reporting**: Detailed test reports
- **Configuration**: Environment-specific settings

## Integrating All Layers
- BDD for test scenarios
- POM for UI tests
- API testing for backend
- DB testing for data validation
- Performance monitoring

## Real-time Example: Complete MakeMyTrip Framework
See examples/ folder for the complete framework structure.

Run: npx playwright test examples/e2e-flow.spec.ts