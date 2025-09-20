# Boulders API Reference

## Overview

This document outlines the key API endpoints from the BRP API3 system that are relevant for the Boulders Member Portal application.

**Base URL**: `https://api.example.com/api/ver3` (replace with actual endpoint)

## Authentication

All API requests require authentication using Bearer tokens.

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": 3600
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "string"
}
```

## Core Endpoints for Member Portal

### 1. Customer Management

#### Get Customer Profile
```http
GET /customers/{customerId}
Authorization: Bearer {accessToken}
```

#### Update Customer Profile
```http
PUT /customers/{customerId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "phone": "string"
}
```

### 2. Bookings & Activities

#### List Customer Bookings
```http
GET /customers/{customerId}/bookings
Authorization: Bearer {accessToken}
```

#### List Group Activities
```http
GET /apps/groupactivities
Authorization: Bearer {accessToken}
```

#### Book Group Activity
```http
POST /customers/{customerId}/bookings/groupactivities
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "activityId": "string",
  "date": "2024-01-15",
  "time": "18:00"
}
```

#### Cancel Booking
```http
DELETE /customers/{customerId}/bookings/{bookingId}
Authorization: Bearer {accessToken}
```

### 3. Payments & Subscriptions

#### List Customer Payments
```http
GET /customers/{customerId}/payments
Authorization: Bearer {accessToken}
```

#### List Customer Subscriptions
```http
GET /customers/{customerId}/subscriptions
Authorization: Bearer {accessToken}
```

### 4. Resources & Facilities

#### List Available Resources
```http
GET /apps/resources
Authorization: Bearer {accessToken}
```

#### Check Resource Availability
```http
GET /businessunits/{unitId}/resourceviews/bookings
Authorization: Bearer {accessToken}
Query Parameters:
- start: ISO date string
- end: ISO date string
- resourceId: string
```

### 5. Membership Management

#### Get Membership Information
```http
GET /customers/{customerId}/membership
Authorization: Bearer {accessToken}
```

#### Perform Membership Action
```http
POST /customers/{customerId}/membership/actions
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "type": "freeze" | "cancel" | "upgrade" | "downgrade" | "resume",
  "planId": "string", // required for upgrade/downgrade
  "reason": "string", // optional
  "effectiveDate": "2024-01-15", // optional
  "duration": 30 // optional, for freeze duration in days
}
```

#### Get Available Plans
```http
GET /membership/plans
Authorization: Bearer {accessToken}
```

#### Get Membership Invoices
```http
GET /customers/{customerId}/membership/invoices
Authorization: Bearer {accessToken}
Query Parameters:
- limit: number
- offset: number
```

#### Download Invoice
```http
GET /customers/{customerId}/membership/invoices/{invoiceId}/download
Authorization: Bearer {accessToken}
```

## Data Models

### Customer
```typescript
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  membershipType: string
  status: 'active' | 'suspended' | 'cancelled'
  joinDate: string
}
```

### Booking
```typescript
interface Booking {
  id: string
  customerId: string
  activityId: string
  activityName: string
  date: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'cancelled' | 'waitlist'
  cost: number
}
```

### Activity
```typescript
interface Activity {
  id: string
  name: string
  description: string
  duration: number
  capacity: number
  instructor: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cost: number
}
```

### Payment
```typescript
interface Payment {
  id: string
  customerId: string
  amount: number
  currency: string
  date: string
  description: string
  status: 'pending' | 'completed' | 'failed'
  method: 'card' | 'bank_transfer' | 'cash'
}
```

### Membership Subscription
```typescript
interface MembershipSubscription {
  id: string
  planId: string
  planName: string
  status: 'active' | 'paused' | 'cancelled' | 'pending_cancellation'
  startDate: string
  renewalDate: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  pausedUntil?: string
  cancellationDate?: string
  cancellationReason?: string
}
```

### Membership Plan
```typescript
interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  isPopular?: boolean
}
```

### Membership Invoice
```typescript
interface MembershipInvoice {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  issueDate: string
  dueDate: string
  paidDate?: string
  downloadUrl: string
  description: string
}
```

## Error Handling

### Common Error Responses
```json
{
  "errorCode": "string",
  "errorMessage": "string",
  "fieldErrors": [
    {
      "field": "string",
      "errorCode": "string",
      "errorMessage": "string"
    }
  ]
}
```

### HTTP Status Codes
- `200 OK` - Successful GET/PUT requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

### Common Error Codes
- `INVALID_INPUT` - Request validation failed
- `CUSTOMER_NOT_FOUND` - Customer ID not found
- `BOOKING_NOT_AVAILABLE` - Activity is fully booked
- `PAYMENT_FAILED` - Payment processing failed
- `UNAUTHORIZED_ACCESS` - User lacks permission

## Query Parameters

### Filtering
Most list endpoints support filtering:
```http
GET /customers/{customerId}/bookings?start=2024-01-01&end=2024-12-31&status=confirmed
```

### Pagination
```http
GET /customers?page=1&limit=20
```

### Sorting
```http
GET /customers/{customerId}/bookings?sort=date&order=desc
```

## Implementation Notes

1. **Authentication**: Store access tokens securely and implement automatic refresh
2. **Error Handling**: Always check for error responses and handle gracefully
3. **Caching**: Consider caching frequently accessed data like activities and resources
4. **Real-time Updates**: For bookings, consider implementing polling or webhooks
5. **Offline Support**: Cache critical data for offline functionality

## Environment Configuration

```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.boulders.dk/api/ver3',
  timeout: 10000,
  retries: 3
}
```

## Usage Examples

### React Hook for Customer Data
```typescript
// src/hooks/useCustomerProfile.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'

export function useCustomerProfile(customerId: string) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => apiClient.get(`/customers/${customerId}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### API Client Setup
```typescript
// src/lib/apiClient.ts
import axios from 'axios'
import { API_CONFIG } from '@/config/api'

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
})

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```
