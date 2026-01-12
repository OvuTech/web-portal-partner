# Partner Data Upload Endpoints

This document lists all API endpoints needed for partners to upload data (routes, schedules, CSV files, etc.) to the OVU platform.

---

## Available Endpoints

### 1. Routes Management

#### POST `/api/v1/operators/routes`
- **Summary:** Create Route
- **Description:** Create a new route
- **Auth:** Bearer Token
- **Request Body:** `RouteCreate`
  ```json
  {
    "origin": "string (required)",
    "destination": "string (required)",
    "origin_terminal": "string (optional)",
    "destination_terminal": "string (optional)",
    "distance_km": "number (optional, > 0)",
    "estimated_duration_minutes": "integer (required, > 0)",
    "base_price": "number (required, > 0)",
    "description": "string (optional)",
    "amenities": ["string"] (optional, default: [])
  }
  ```
- **Response:** 201 - `RouteResponse`
- **Use Case:** Create individual routes manually

#### GET `/api/v1/operators/routes`
- **Summary:** List Routes
- **Description:** List operator's routes with optional filters
- **Auth:** Bearer Token
- **Query Params:**
  - `origin` (string, optional)
  - `destination` (string, optional)
  - `is_active` (boolean, optional)
  - `skip` (integer, default: 0)
  - `limit` (integer, default: 50)
- **Response:** 200 - Array of `RouteResponse`
- **Use Case:** Get existing routes before creating schedules

#### PUT `/api/v1/operators/routes/{route_id}`
- **Summary:** Update Route
- **Description:** Update route details
- **Auth:** Bearer Token
- **Path Params:** `route_id` (string, required)
- **Request Body:** `RouteUpdate`
- **Response:** 200 - `RouteResponse`
- **Use Case:** Update route information

#### DELETE `/api/v1/operators/routes/{route_id}`
- **Summary:** Delete Route
- **Description:** Soft delete route (mark as inactive)
- **Auth:** Bearer Token
- **Path Params:** `route_id` (string, required)
- **Response:** 204
- **Use Case:** Deactivate routes

---

### 2. Schedules Management

#### POST `/api/v1/operators/schedules`
- **Summary:** Create Schedule
- **Description:** Create a new schedule
- **Auth:** Bearer Token
- **Request Body:** `ScheduleCreate`
  ```json
  {
    "route_id": "string (required)",
    "departure_date": "datetime (required, ISO 8601)",
    "arrival_date": "datetime (required, ISO 8601)",
    "vehicle_number": "string (optional)",
    "vehicle_type": "string (optional)",
    "driver_name": "string (optional)",
    "driver_phone": "string (optional)",
    "total_seats": "integer (required, > 0)",
    "price": "number (required, > 0)",
    "amenities": ["string"] (optional, default: []),
    "notes": "string (optional)"
  }
  ```
- **Response:** 201 - `ScheduleResponse`
- **Use Case:** Create individual schedules manually or programmatically

#### GET `/api/v1/operators/schedules`
- **Summary:** List Schedules
- **Description:** List operator's schedules with filters
- **Auth:** Bearer Token
- **Query Params:**
  - `status` (string, optional) - Filter by status: active, upcoming, past
  - `route_id` (string, optional) - Filter by route ID
  - `start_date` (datetime, optional) - Filter by start date
  - `end_date` (datetime, optional) - Filter by end date
  - `skip` (integer, default: 0)
  - `limit` (integer, default: 50)
- **Response:** 200 - Array of `ScheduleResponse`
- **Use Case:** View existing schedules

#### PUT `/api/v1/operators/schedules/{schedule_id}`
- **Summary:** Update Schedule
- **Description:** Update schedule details
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Request Body:** `ScheduleUpdate`
- **Response:** 200 - `ScheduleResponse`
- **Use Case:** Update schedule information

#### DELETE `/api/v1/operators/schedules/{schedule_id}`
- **Summary:** Cancel Schedule
- **Description:** Cancel schedule
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Response:** 204
- **Use Case:** Cancel/deactivate schedules

---

### 3. CSV Export (Available)

#### GET `/api/v1/operators/schedules/export/csv`
- **Summary:** Export Schedules Csv
- **Description:** Export schedules to CSV
- **Auth:** Bearer Token
- **Query Params:**
  - `status` (string, optional)
  - `start_date` (datetime, optional)
  - `end_date` (datetime, optional)
- **Response:** 200 - CSV file download
- **Use Case:** Download existing schedules as CSV template

---

## Missing Endpoints (Not in API Documentation)

### ❌ CSV Upload/Bulk Import

**Status:** NOT FOUND in OpenAPI spec

**Needed Endpoint:**
- **POST `/api/v1/operators/schedules/import/csv`** or
- **POST `/api/v1/operators/schedules/bulk`**

**Expected Functionality:**
- Accept CSV file upload (multipart/form-data)
- Parse CSV and create multiple schedules in bulk
- Return success/failure report for each row
- Support validation and error reporting

**Alternative Solution:**
- Use `POST /api/v1/operators/schedules` in a loop for each CSV row
- Client-side CSV parsing and multiple API calls
- Less efficient but functional

---

## Recommended Upload Workflow

### For Manual Route Creation:
1. **Create Route:** `POST /api/v1/operators/routes`
2. **Verify Route:** `GET /api/v1/operators/routes/{route_id}`
3. **Create Schedule:** `POST /api/v1/operators/schedules` (using route_id)

### For CSV Upload (Current Workaround):
1. **Export Template:** `GET /api/v1/operators/schedules/export/csv` (to get format)
2. **Parse CSV:** Client-side parsing
3. **Bulk Create:** Loop through rows and call `POST /api/v1/operators/schedules` for each
4. **Handle Errors:** Collect and display validation errors per row

### For Bulk Schedule Creation:
1. **Get Routes:** `GET /api/v1/operators/routes` (to get route IDs)
2. **Create Multiple Schedules:** Multiple `POST /api/v1/operators/schedules` calls
3. **Track Progress:** Monitor success/failure for each schedule

---

## Request/Response Examples

### Create Route Example

**Request:**
```http
POST /api/v1/operators/routes
Authorization: Bearer <token>
Content-Type: application/json

{
  "origin": "Lagos",
  "destination": "Abuja",
  "origin_terminal": "Lagos (Iyanapaja)",
  "destination_terminal": "Abuja (Jabi)",
  "estimated_duration_minutes": 480,
  "base_price": 15000,
  "description": "Lagos to Abuja route",
  "amenities": ["WiFi", "AC", "Charging Ports"]
}
```

**Response:**
```json
{
  "id": "route_123",
  "operator_id": "op_456",
  "origin": "Lagos",
  "destination": "Abuja",
  "origin_terminal": "Lagos (Iyanapaja)",
  "destination_terminal": "Abuja (Jabi)",
  "estimated_duration_minutes": 480,
  "base_price": 15000,
  "currency": "NGN",
  "status": "active",
  "is_active": true,
  "created_at": "2024-12-20T12:00:00Z",
  "updated_at": "2024-12-20T12:00:00Z"
}
```

### Create Schedule Example

**Request:**
```http
POST /api/v1/operators/schedules
Authorization: Bearer <token>
Content-Type: application/json

{
  "route_id": "route_123",
  "departure_date": "2024-12-25T08:00:00Z",
  "arrival_date": "2024-12-25T16:00:00Z",
  "vehicle_number": "SMK-888-TU",
  "vehicle_type": "Bus",
  "driver_name": "John Doe",
  "driver_phone": "+2348000000000",
  "total_seats": 35,
  "price": 15000,
  "amenities": ["WiFi", "AC"],
  "notes": "Morning trip"
}
```

**Response:**
```json
{
  "id": "schedule_789",
  "operator_id": "op_456",
  "route_id": "route_123",
  "origin": "Lagos",
  "destination": "Abuja",
  "departure_date": "2024-12-25T08:00:00Z",
  "arrival_date": "2024-12-25T16:00:00Z",
  "vehicle_number": "SMK-888-TU",
  "vehicle_type": "Bus",
  "total_seats": 35,
  "available_seats": 35,
  "booked_seats": 0,
  "price": 15000,
  "currency": "NGN",
  "status": "active",
  "trip_type": "one_way",
  "created_at": "2024-12-20T12:00:00Z",
  "updated_at": "2024-12-20T12:00:00Z"
}
```

---

## CSV Format Recommendation

If implementing CSV upload, recommended format:

```csv
route_id,departure_date,arrival_date,vehicle_number,vehicle_type,driver_name,driver_phone,total_seats,price,amenities,notes
route_123,2024-12-25T08:00:00Z,2024-12-25T16:00:00Z,SMK-888-TU,Bus,John Doe,+2348000000000,35,15000,"WiFi,AC",Morning trip
route_123,2024-12-25T14:00:00Z,2024-12-25T22:00:00Z,ABC-123-LAG,Bus,Jane Smith,+2348000000001,35,15000,"WiFi,AC",Afternoon trip
```

**Required Fields:**
- `route_id` - Must exist (create route first)
- `departure_date` - ISO 8601 format
- `arrival_date` - ISO 8601 format
- `total_seats` - Integer > 0
- `price` - Number > 0

**Optional Fields:**
- `vehicle_number`
- `vehicle_type`
- `driver_name`
- `driver_phone`
- `amenities` - Comma-separated list
- `notes`

---

## Implementation Notes

1. **Authentication:** All endpoints require Bearer Token authentication
2. **Rate Limiting:** Be aware of rate limits when doing bulk uploads
3. **Error Handling:** Each schedule creation should handle validation errors
4. **Transaction Safety:** Consider implementing rollback if bulk upload partially fails
5. **Progress Tracking:** For bulk operations, track progress and show to user

---

## Summary

**Available for Upload:**
- ✅ Routes: `POST /api/v1/operators/routes`
- ✅ Schedules (Single): `POST /api/v1/operators/schedules`
- ✅ CSV Export: `GET /api/v1/operators/schedules/export/csv`

**Missing:**
- ❌ CSV Upload/Bulk Import: `POST /api/v1/operators/schedules/import/csv` (NOT FOUND)

**Workaround for CSV Upload:**
- Parse CSV client-side
- Loop through rows
- Call `POST /api/v1/operators/schedules` for each row
- Collect and display errors

---

**Last Updated:** Based on OpenAPI 3.1.0 specification review


