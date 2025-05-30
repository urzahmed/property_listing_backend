# Property Listing API

A RESTful API for managing property listings with user authentication.

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
The GET /api/properties endpoint supports advanced search and filtering with the following query parameters:

```bash
# Basic search with multiple filters
curl -X GET "http://localhost:5000/api/properties/search?type=Bungalow&city=Coimbatore&state=Tamil Nadu"

# Search with date filter
curl -X GET "http://localhost:5000/api/properties/search?availableFrom=2025-10-14&listingType=rent"

# Search with area range
curl -X GET "http://localhost:5000/api/properties/search?minArea=1000&maxArea=3000&city=Coimbatore"
```

Available Query Parameters:
- `search`: Text search in title, city, state, and listedBy fields
- `type`: Property type (e.g., Apartment, House)
- `listingType`: Sale or Rent
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `minArea`: Minimum area in sq ft
- `maxArea`: Maximum area in sq ft
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `furnished`: Furnishing status
- `availableFrom`: Available from date (YYYY-MM-DD)
- `colorTheme`: Color theme
- `minRating`: Minimum rating
- `isVerified`: Verification status (true/false)
- `page`: Page number for pagination
- `limit`: Number of items per page
- `sort`: Sort fields (e.g., price:desc,createdAt:desc)

Response:
```json
{
  "success": true,
  "count": 1,
  "total": 50,
  "totalPages": 5,
  "currentPage": 1,
  "data": [
    {
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
      "rating": 4.5,
      "isVerified": true,
      "createdBy": {
        "_id": "user_id_here",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### Create a Property
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
  }
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