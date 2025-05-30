# Property Listing API

A RESTful API for managing property listings with user authentication and Redis caching.

## Architecture

### Redis Caching Implementation

The application uses Upstash Redis for caching to optimize performance and reduce database load. Here's how the caching system works:

#### 1. Cache Configuration
- **Redis Client**: Configured using Upstash Redis REST API
- **Cache TTL (Time To Live)**:
  - Property List: 5 minutes (300 seconds)
  - Property Detail: 10 minutes (600 seconds)
  - Search Results: 5 minutes (300 seconds)

#### 2. Caching Strategy

##### Read Operations
- **Property List** (`GET /api/properties`):
  - Caches the entire property list
  - Cache key: `property:list`
  - Invalidated on new property creation or updates

- **Property Detail** (`GET /api/properties/:id`):
  - Caches individual property details
  - Cache key: `property:detail:{propertyId}`
  - Invalidated when the specific property is updated or deleted

- **Property Search** (`GET /api/properties/search`):
  - Caches search results based on query parameters
  - Cache key: `property:search:{queryString}`
  - Each unique search query combination has its own cache

##### Write Operations
- **Create Property** (`POST /api/properties`):
  - Invalidates all property caches
  - Ensures new properties are immediately available

- **Update Property** (`PUT /api/properties/:id`):
  - Invalidates specific property cache
  - Invalidates property list cache
  - Maintains data consistency

- **Delete Property** (`DELETE /api/properties/:id`):
  - Invalidates specific property cache
  - Invalidates property list cache
  - Removes deleted property from cache

#### 3. Cache Invalidation Strategy
- **Selective Invalidation**: Updates only affect relevant caches
- **Full Invalidation**: Used when creating new properties
- **Pattern-based Invalidation**: Uses Redis pattern matching for efficient cache clearing

#### 4. Response Enhancement
- Added `fromCache` flag in responses
- Helps track cache hit/miss rates
- Useful for monitoring cache effectiveness

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/property_listing
JWT_SECRET=your_jwt_secret_here
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

3. Start the server:
```bash
npm run dev
```

## API Documentation

### Authentication

#### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}'
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
}
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "password123"
}'
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
}
```

#### Get Current User Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
-H "Authorization: Bearer jwt_token_here"
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Properties

#### Advanced Search and Filtering
The GET /api/properties/search endpoint supports advanced search and filtering with the following query parameters:

```bash
# Basic search with multiple filters
curl -X GET "http://localhost:5000/api/properties/search?type=apartment&minPrice=300000&maxPrice=400000&bedrooms=2&bathrooms=2&furnished=Fully%20Furnished&minRating=4"

# Search with date filter
curl -X GET "http://localhost:5000/api/properties/search?availableFrom=2024-03-01"
```

Response:
```json
{
  "success": true,
  "count": number_of_properties,
  "data": [
    {
      // property details
    }
  ],
  "fromCache": true/false
}
```

#### Create Property
```bash
curl -X POST http://localhost:5000/api/properties \
-H "Content-Type: application/json" \
-H "Authorization: Bearer jwt_token_here" \
-d '{
  "title": "Luxury Apartment",
  "type": "Apartment",
  "price": 350000,
  "state": "California",
  "city": "Los Angeles",
  "areaSqFt": 1200,
  "bedrooms": 2,
  "bathrooms": 2,
  "furnished": "Fully Furnished",
  "availableFrom": "2024-03-01",
  "listedBy": "John Doe",
  "colorTheme": "Modern",
  "listingType": "Sale"
}'
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "property_id_here",
    "title": "Luxury Apartment",
    "type": "Apartment",
    "price": 350000,
    "state": "California",
    "city": "Los Angeles",
    "areaSqFt": 1200,
    "bedrooms": 2,
    "bathrooms": 2,
    "furnished": "Fully Furnished",
    "availableFrom": "2024-03-01",
    "listedBy": "John Doe",
    "colorTheme": "Modern",
    "listingType": "Sale",
    "createdBy": "user_id_here"
  }
}
```

#### Get Property by ID
```bash
curl -X GET http://localhost:5000/api/properties/property_id_here
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "property_id_here",
    "title": "Luxury Apartment",
    "type": "Apartment",
    "price": 350000,
    "state": "California",
    "city": "Los Angeles",
    "areaSqFt": 1200,
    "bedrooms": 2,
    "bathrooms": 2,
    "furnished": "Fully Furnished",
    "availableFrom": "2024-03-01",
    "listedBy": "John Doe",
    "colorTheme": "Modern",
    "listingType": "Sale",
    "createdBy": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "fromCache": true/false
}
```

#### Update Property
```bash
curl -X PUT http://localhost:5000/api/properties/property_id_here \
-H "Content-Type: application/json" \
-H "Authorization: Bearer jwt_token_here" \
-d '{
  "price": 360000,
  "rating": 4.5
}'
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "property_id_here",
    "title": "Luxury Apartment",
    "type": "Apartment",
    "price": 360000,
    "state": "California",
    "city": "Los Angeles",
    "areaSqFt": 1200,
    "bedrooms": 2,
    "bathrooms": 2,
    "furnished": "Fully Furnished",
    "availableFrom": "2024-03-01",
    "listedBy": "John Doe",
    "colorTheme": "Modern",
    "listingType": "Sale",
    "rating": 4.5,
    "createdBy": "user_id_here"
  }
}
```

#### Delete Property
```bash
curl -X DELETE http://localhost:5000/api/properties/property_id_here \
-H "Authorization: Bearer jwt_token_here"
```

Response:
```json
{
  "success": true,
  "data": {}
}
```

## Error Responses

### Authentication Error
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Property not found"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Invalid input data"
}
```

## Notes

1. All protected routes require a valid JWT token in the Authorization header
2. Property updates and deletions can only be performed by the property creator
3. The JWT token expires after 30 days
4. All dates should be in ISO format (YYYY-MM-DD)
5. Advanced search supports multiple filters that can be combined
6. Search results are paginated with a default of 10 items per page
7. Results can be sorted by any field using the sort parameter
8. Redis caching is implemented for all read operations
9. Cache invalidation is automatic for write operations
10. The `fromCache` flag in responses indicates if data was served from cache 