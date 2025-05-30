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

#### Get All Properties
```bash
curl -X GET http://localhost:5000/api/properties
```

Response:
```json
{
  "success": true,
  "count": 1,
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
      "createdBy": {
        "_id": "user_id_here",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
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