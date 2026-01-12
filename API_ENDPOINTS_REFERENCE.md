# OVU Transport Aggregator API Endpoints Reference

**Version:** v1  
**Base URL:** `/api/v1`  
**Documentation:** OpenAPI 3.1.0

---

## Table of Contents

1. [Health & Root](#health--root)
2. [Authentication (User)](#authentication-user)
3. [Bookings (User)](#bookings-user)
4. [Flights](#flights)
5. [Road Transport](#road-transport)
6. [User Profile](#user-profile)
7. [Saved Passengers](#saved-passengers)
8. [Notifications](#notifications)
9. [Content](#content)
10. [Payments](#payments)
11. [Operators](#operators)
12. [Partners (Admin)](#partners-admin)
13. [Partner API](#partner-api)
14. [Partner Authentication](#partner-authentication)
15. [Operator Authentication](#operator-authentication)
16. [Admin](#admin)
17. [Waitlist](#waitlist)
18. [Partnerships](#partnerships)
19. [Questions](#questions)

---

## Health & Root

### GET `/health`
- **Summary:** Health Check
- **Description:** Health check endpoint for monitoring
- **Auth:** None
- **Response:** 200

### GET `/`
- **Summary:** Root
- **Description:** Root endpoint
- **Auth:** None
- **Response:** 200

---

## Authentication (User)

### POST `/api/v1/auth/register`
- **Summary:** Register
- **Description:** Register a new user
- **Auth:** None
- **Request Body:** `UserRegister`
- **Response:** 201 - `UserResponse`

### POST `/api/v1/auth/login`
- **Summary:** Login
- **Description:** User login
- **Auth:** None
- **Request Body:** `UserLogin`
- **Response:** 200 - `Token`

### POST `/api/v1/auth/verify`
- **Summary:** Verify User
- **Description:** Verify user account
- **Auth:** None
- **Request Body:** `UserVerify`
- **Response:** 200

### POST `/api/v1/auth/resend-verification`
- **Summary:** Resend Verification
- **Description:** Resend verification code
- **Auth:** None
- **Request Body:** `ResendVerification`
- **Response:** 200

### POST `/api/v1/auth/login/otp`
- **Summary:** Login Otp
- **Description:** Request OTP for login
- **Auth:** None
- **Request Body:** `OTPLoginRequest`
- **Response:** 200

### POST `/api/v1/auth/login/otp/verify`
- **Summary:** Verify Otp Login
- **Description:** Verify OTP and login
- **Auth:** None
- **Request Body:** `OTPVerifyRequest`
- **Response:** 200 - `Token`

### GET `/api/v1/auth/google/authorize`
- **Summary:** Google Authorize
- **Description:** Get Google OAuth authorization URL
- **Auth:** None
- **Response:** 200

### GET `/api/v1/auth/google/callback`
- **Summary:** Google Callback
- **Description:** Handle Google OAuth callback
- **Auth:** None
- **Query Params:** `code` (string, required)
- **Response:** 200 - `Token`

### GET `/api/v1/auth/me`
- **Summary:** Get Current User Info
- **Description:** Get current user information
- **Auth:** Bearer Token
- **Response:** 200 - `UserResponse`

### POST `/api/v1/auth/forgot-password`
- **Summary:** Forgot Password
- **Description:** Request password reset
- **Auth:** None
- **Request Body:** Object with email
- **Response:** 200

### POST `/api/v1/auth/reset-password`
- **Summary:** Reset Password
- **Description:** Reset password with token
- **Auth:** None
- **Request Body:** Object with token and new_password
- **Response:** 200

### PUT `/api/v1/auth/change-password`
- **Summary:** Change Password
- **Description:** Change password (authenticated)
- **Auth:** Bearer Token
- **Request Body:** Object with current_password and new_password
- **Response:** 200

---

## Bookings (User)

### POST `/api/v1/bookings/search`
- **Summary:** Search Transport
- **Description:** Unified search across all transport types
- **Auth:** None
- **Request Body:** `SearchRequest`
- **Response:** 200 - Array of `SearchResult`

### POST `/api/v1/bookings/`
- **Summary:** Create Booking
- **Description:** Create a new booking
- **Auth:** Bearer Token
- **Request Body:** `BookingCreate`
- **Response:** 201 - `BookingResponse`

### GET `/api/v1/bookings/`
- **Summary:** Get User Bookings
- **Description:** Get user's bookings
- **Auth:** Bearer Token
- **Query Params:** 
  - `skip` (integer, default: 0)
  - `limit` (integer, default: 10)
- **Response:** 200 - Array of `BookingResponse`

### GET `/api/v1/bookings/{booking_id}`
- **Summary:** Get Booking
- **Description:** Get a specific booking
- **Auth:** Bearer Token
- **Path Params:** `booking_id` (string, required)
- **Response:** 200 - `BookingResponse`

### POST `/api/v1/bookings/{booking_id}/cancel`
- **Summary:** Cancel Booking
- **Description:** Cancel a booking
- **Auth:** Bearer Token
- **Path Params:** `booking_id` (string, required)
- **Response:** 200

---

## Flights

### GET `/api/v1/flights/airports`
- **Summary:** Get Airports
- **Description:** Get list of available airports
- **Auth:** None
- **Response:** 200 - Array of `AirportResponse`

### POST `/api/v1/flights/search`
- **Summary:** Search Flights
- **Description:** Search for flights
- **Auth:** None
- **Request Body:** `FlightSearchRequest`
- **Response:** 200 - Array of `FlightSearchResult`

### POST `/api/v1/flights/book`
- **Summary:** Book Flight
- **Description:** Create a flight booking
- **Auth:** Bearer Token
- **Request Body:** `FlightBookingRequest`
- **Response:** 201 - `FlightBookingResponse`

### GET `/api/v1/flights/bookings`
- **Summary:** Get Flight Bookings
- **Description:** Get user's flight bookings
- **Auth:** Bearer Token
- **Query Params:**
  - `skip` (integer, min: 0, default: 0)
  - `limit` (integer, min: 1, max: 100, default: 10)
- **Response:** 200 - Array of `FlightBookingResponse`

### GET `/api/v1/flights/{booking_id}`
- **Summary:** Get Flight Booking
- **Description:** Get specific flight booking details
- **Auth:** Bearer Token
- **Path Params:** `booking_id` (string, required)
- **Response:** 200 - `FlightBookingResponse`

---

## Road Transport

### GET `/api/v1/road/terminals`
- **Summary:** Get Terminals
- **Description:** Get list of available bus terminals
- **Auth:** None
- **Response:** 200 - Array of `TerminalResponse`

### POST `/api/v1/road/search`
- **Summary:** Search Road Trips
- **Description:** Search for road trips
- **Auth:** None
- **Request Body:** `RoadSearchRequest`
- **Response:** 200 - Array of `RoadSearchResult`

### GET `/api/v1/road/seats/{trip_id}`
- **Summary:** Get Available Seats
- **Description:** Get available seats for a trip
- **Auth:** None
- **Path Params:** `trip_id` (string, required)
- **Response:** 200 - Array of `SeatInfo`

### POST `/api/v1/road/seats/select`
- **Summary:** Select Seats
- **Description:** Select and hold seats for a trip
- **Auth:** Bearer Token
- **Request Body:** `SeatSelectionRequest`
- **Response:** 200 - `SeatSelectionResponse`

### POST `/api/v1/road/book`
- **Summary:** Book Road Trip
- **Description:** Create a road trip booking
- **Auth:** Bearer Token
- **Request Body:** `RoadBookingRequest`
- **Response:** 201 - `RoadBookingResponse`

### GET `/api/v1/road/bookings`
- **Summary:** Get Road Bookings
- **Description:** Get user's road bookings
- **Auth:** Bearer Token
- **Query Params:**
  - `skip` (integer, min: 0, default: 0)
  - `limit` (integer, min: 1, max: 100, default: 10)
- **Response:** 200 - Array of `RoadBookingResponse`

---

## User Profile

### GET `/api/v1/user/profile`
- **Summary:** Get User Profile
- **Description:** Get current user profile
- **Auth:** Bearer Token
- **Response:** 200 - `UserProfileResponse`

### PUT `/api/v1/user/profile`
- **Summary:** Update User Profile
- **Description:** Update user profile
- **Auth:** Bearer Token
- **Request Body:** `UserProfileUpdate`
- **Response:** 200 - `UserProfileResponse`

### POST `/api/v1/user/profile/photo`
- **Summary:** Upload Profile Photo
- **Description:** Upload user profile photo
- **Auth:** Bearer Token
- **Request Body:** Multipart form data with `file`
- **Response:** 200 - `ProfilePhotoUploadResponse`

### DELETE `/api/v1/user/account`
- **Summary:** Delete User Account
- **Description:** Delete user account (soft or hard delete)
- **Auth:** Bearer Token
- **Request Body:** `AccountDeletionRequest`
- **Response:** 200 - `AccountDeletionResponse`

---

## Saved Passengers

### POST `/api/v1/passengers/save`
- **Summary:** Save Passenger
- **Description:** Save a passenger for quick booking
- **Auth:** Bearer Token
- **Request Body:** `SavedPassengerCreate`
- **Response:** 201 - `SavedPassengerResponse`

### GET `/api/v1/passengers/`
- **Summary:** Get Saved Passengers
- **Description:** Get user's saved passengers
- **Auth:** Bearer Token
- **Query Params:**
  - `skip` (integer, min: 0, default: 0)
  - `limit` (integer, min: 1, max: 100, default: 50)
- **Response:** 200 - Array of `SavedPassengerResponse`

### PUT `/api/v1/passengers/{passenger_id}`
- **Summary:** Update Saved Passenger
- **Description:** Update a saved passenger
- **Auth:** Bearer Token
- **Path Params:** `passenger_id` (string, required)
- **Request Body:** `SavedPassengerUpdate`
- **Response:** 200 - `SavedPassengerResponse`

### DELETE `/api/v1/passengers/{passenger_id}`
- **Summary:** Delete Saved Passenger
- **Description:** Delete a saved passenger
- **Auth:** Bearer Token
- **Path Params:** `passenger_id` (string, required)
- **Response:** 200

---

## Notifications

### GET `/api/v1/notifications/`
- **Summary:** Get Notifications
- **Description:** Get user notifications
- **Auth:** Bearer Token
- **Query Params:**
  - `skip` (integer, min: 0, default: 0)
  - `limit` (integer, min: 1, max: 100, default: 20)
  - `unread_only` (boolean, default: false) - Filter for unread notifications only
- **Response:** 200 - Array of `NotificationResponse`

### GET `/api/v1/notifications/unread-count`
- **Summary:** Get Unread Count
- **Description:** Get count of unread notifications
- **Auth:** Bearer Token
- **Response:** 200 - `UnreadCountResponse`

### POST `/api/v1/notifications/{notification_id}/read`
- **Summary:** Mark Notification As Read
- **Description:** Mark a notification as read
- **Auth:** Bearer Token
- **Path Params:** `notification_id` (string, required)
- **Response:** 200

### POST `/api/v1/notifications/read-all`
- **Summary:** Mark All Notifications As Read
- **Description:** Mark all notifications as read
- **Auth:** Bearer Token
- **Response:** 200

---

## Content

### GET `/api/v1/content/articles`
- **Summary:** Get Articles
- **Description:** Get published articles
- **Auth:** None
- **Query Params:**
  - `category` (string, optional)
  - `tag` (string, optional)
  - `skip` (integer, min: 0, default: 0)
  - `limit` (integer, min: 1, max: 100, default: 20)
- **Response:** 200 - Array of `ArticleListResponse`

### GET `/api/v1/content/articles/{article_id}`
- **Summary:** Get Article
- **Description:** Get article by ID or slug
- **Auth:** None
- **Path Params:** `article_id` (string, required)
- **Response:** 200 - `ArticleResponse`

### GET `/api/v1/content/faqs`
- **Summary:** Get Faqs
- **Description:** Get active FAQs
- **Auth:** None
- **Query Params:**
  - `category` (string, optional)
  - `skip` (integer, min: 0, default: 0)
  - `limit` (integer, min: 1, max: 100, default: 50)
- **Response:** 200 - Array of `FAQListResponse`

### GET `/api/v1/content/faqs/{faq_id}`
- **Summary:** Get Faq
- **Description:** Get specific FAQ
- **Auth:** None
- **Path Params:** `faq_id` (string, required)
- **Response:** 200 - `FAQResponse`

### POST `/api/v1/content/faqs/{faq_id}/helpful`
- **Summary:** Mark Faq Helpful
- **Description:** Mark FAQ as helpful
- **Auth:** None
- **Path Params:** `faq_id` (string, required)
- **Response:** 200

---

## Payments

### POST `/api/v1/payments/initialize`
- **Summary:** Initialize Payment
- **Description:** Initialize a payment for a booking
- **Auth:** Bearer Token
- **Request Body:** `PaymentInitiate`
- **Response:** 201 - `PaymentResponse`

### POST `/api/v1/payments/webhook`
- **Summary:** Payment Webhook
- **Description:** Handle Paystack webhooks
- **Auth:** None
- **Response:** 200

### GET `/api/v1/payments/{payment_id}`
- **Summary:** Get Payment
- **Description:** Get payment details
- **Auth:** Bearer Token
- **Path Params:** `payment_id` (string, required)
- **Response:** 200 - `PaymentResponse`

### POST `/api/v1/payments/refund`
- **Summary:** Request Refund
- **Description:** Request a refund
- **Auth:** Bearer Token
- **Request Body:** `RefundRequest`
- **Response:** 202

---

## Operators

### GET `/api/v1/operators/dashboard`
- **Summary:** Get Dashboard
- **Description:** Get operator dashboard data - supports dual-role users
- **Auth:** Bearer Token
- **Response:** 200

### GET `/api/v1/operators/bookings`
- **Summary:** Get Operator Bookings
- **Description:** Get operator's bookings
- **Auth:** Bearer Token
- **Query Params:**
  - `skip` (integer, default: 0)
  - `limit` (integer, default: 20)
- **Response:** 200

### GET `/api/v1/operators/sales`
- **Summary:** Get Sales Analytics
- **Description:** Get sales analytics
- **Auth:** Bearer Token
- **Query Params:**
  - `days` (integer, default: 30)
- **Response:** 200

### GET `/api/v1/operators/payouts`
- **Summary:** Get Payouts
- **Description:** Get payout information
- **Auth:** Bearer Token
- **Response:** 200

### POST `/api/v1/operators/routes`
- **Summary:** Create Route
- **Description:** Create a new route
- **Auth:** Bearer Token
- **Request Body:** `RouteCreate`
- **Response:** 201 - `RouteResponse`

### GET `/api/v1/operators/routes`
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

### GET `/api/v1/operators/routes/{route_id}`
- **Summary:** Get Route
- **Description:** Get route details
- **Auth:** Bearer Token
- **Path Params:** `route_id` (string, required)
- **Response:** 200 - `RouteResponse`

### PUT `/api/v1/operators/routes/{route_id}`
- **Summary:** Update Route
- **Description:** Update route
- **Auth:** Bearer Token
- **Path Params:** `route_id` (string, required)
- **Request Body:** `RouteUpdate`
- **Response:** 200 - `RouteResponse`

### DELETE `/api/v1/operators/routes/{route_id}`
- **Summary:** Delete Route
- **Description:** Soft delete route (mark as inactive)
- **Auth:** Bearer Token
- **Path Params:** `route_id` (string, required)
- **Response:** 204

### POST `/api/v1/operators/schedules`
- **Summary:** Create Schedule
- **Description:** Create a new schedule
- **Auth:** Bearer Token
- **Request Body:** `ScheduleCreate`
- **Response:** 201 - `ScheduleResponse`

### GET `/api/v1/operators/schedules`
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

### GET `/api/v1/operators/schedules/{schedule_id}`
- **Summary:** Get Schedule
- **Description:** Get schedule details
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Response:** 200 - `ScheduleResponse`

### PUT `/api/v1/operators/schedules/{schedule_id}`
- **Summary:** Update Schedule
- **Description:** Update schedule
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Request Body:** `ScheduleUpdate`
- **Response:** 200 - `ScheduleResponse`

### DELETE `/api/v1/operators/schedules/{schedule_id}`
- **Summary:** Cancel Schedule
- **Description:** Cancel schedule
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Response:** 204

### GET `/api/v1/operators/schedules/export/csv`
- **Summary:** Export Schedules Csv
- **Description:** Export schedules to CSV
- **Auth:** Bearer Token
- **Query Params:**
  - `status` (string, optional)
  - `start_date` (datetime, optional)
  - `end_date` (datetime, optional)
- **Response:** 200

### GET `/api/v1/operators/schedules/{schedule_id}/manifest`
- **Summary:** Get Manifest
- **Description:** Get manifest data for a schedule
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Response:** 200 - `ManifestResponse`

### GET `/api/v1/operators/schedules/{schedule_id}/manifest/csv`
- **Summary:** Download Manifest Csv
- **Description:** Download manifest as CSV
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Response:** 200

### GET `/api/v1/operators/schedules/{schedule_id}/manifest/pdf`
- **Summary:** Download Manifest Pdf
- **Description:** Download manifest as PDF
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Response:** 200

### POST `/api/v1/operators/schedules/{schedule_id}/manifest/email`
- **Summary:** Email Manifest
- **Description:** Send manifest via email
- **Auth:** Bearer Token
- **Path Params:** `schedule_id` (string, required)
- **Query Params:** `email` (string, required) - Email address to send manifest to
- **Response:** 200

### GET `/api/v1/operators/profile`
- **Summary:** Get Operator Profile
- **Description:** Get combined operator + partner profile for dual-role users
- **Auth:** Bearer Token
- **Response:** 200

### POST `/api/v1/operators/register-operator`
- **Summary:** Register Partner As Operator
- **Description:** Allow existing partners to register as operators. Creates operator entity and links it to their partner account
- **Auth:** Bearer Token
- **Request Body:** `OperatorCreate`
- **Response:** 201

---

## Partners (Admin)

### POST `/api/v1/partners`
- **Summary:** Create Partner
- **Description:** Create a new business partner (Admin only). Returns partner info with initial API credentials
- **Auth:** Bearer Token (Admin)
- **Request Body:** `PartnerCreate`
- **Response:** 201

---

## Partner API

### GET `/api/v1/partners/me`
- **Summary:** Get Current Partner
- **Description:** Get current partner information
- **Auth:** X-API-Key (optional) or Bearer Token
- **Response:** 200 - `PartnerResponse`

### PUT `/api/v1/partners/me`
- **Summary:** Update Current Partner
- **Description:** Update current partner information
- **Auth:** X-API-Key (optional) or Bearer Token
- **Request Body:** `PartnerUpdate`
- **Response:** 200 - `PartnerResponse`

### POST `/api/v1/partners/api-keys`
- **Summary:** Create Api Key
- **Description:** Generate a new API key for the partner
- **Auth:** X-API-Key (optional) or Bearer Token
- **Request Body:** `APIKeyCreate`
- **Response:** 201 - `APIKeyCreateResponse`

### GET `/api/v1/partners/api-keys`
- **Summary:** List Api Keys
- **Description:** List all API keys for the partner
- **Auth:** X-API-Key (optional) or Bearer Token
- **Response:** 200 - Array of `APIKeyResponse`

### DELETE `/api/v1/partners/api-keys/{key_id}`
- **Summary:** Revoke Api Key
- **Description:** Revoke an API key
- **Auth:** X-API-Key (optional) or Bearer Token
- **Path Params:** `key_id` (string, required)
- **Response:** 204

### PUT `/api/v1/partners/api-keys/{key_id}/rotate`
- **Summary:** Rotate Api Key
- **Description:** Rotate an API key (revoke old, create new with same settings)
- **Auth:** X-API-Key (optional) or Bearer Token
- **Path Params:** `key_id` (string, required)
- **Response:** 200 - `APIKeyRotateResponse`

### GET `/api/v1/partners/usage`
- **Summary:** Get Usage Statistics
- **Description:** Get usage statistics for the partner
- **Auth:** X-API-Key (optional) or Bearer Token
- **Query Params:**
  - `days` (integer, default: 30)
- **Response:** 200 - `PartnerUsageStats`

### PUT `/api/v1/partners/webhooks`
- **Summary:** Configure Webhooks
- **Description:** Configure webhook settings for the partner
- **Auth:** X-API-Key (optional) or Bearer Token
- **Request Body:** `WebhookConfigUpdate`
- **Response:** 200 - `WebhookConfigResponse`

### GET `/api/v1/partners/webhooks`
- **Summary:** Get Webhook Config
- **Description:** Get current webhook configuration
- **Auth:** X-API-Key (optional) or Bearer Token
- **Response:** 200 - `WebhookConfigResponse`

### POST `/api/v1/partners/webhooks/test`
- **Summary:** Test Webhook
- **Description:** Test webhook configuration by sending a test event
- **Auth:** X-API-Key (optional) or Bearer Token
- **Request Body:** `WebhookTestRequest`
- **Response:** 200 - `WebhookTestResponse`

### POST `/api/v1/search`
- **Summary:** Partner Search Transport
- **Description:** Partner API: Unified search across all transport types
- **Auth:** X-API-Key (optional) or Bearer Token
- **Request Body:** `SearchRequest`
- **Response:** 200 - Array of `SearchResult`

### POST `/api/v1/bookings`
- **Summary:** Partner Create Booking
- **Description:** Partner API: Create a new booking
- **Auth:** X-API-Key (optional) or Bearer Token
- **Request Body:** `BookingCreate`
- **Response:** 201 - `BookingResponse`

### GET `/api/v1/bookings/{booking_reference}`
- **Summary:** Partner Get Booking
- **Description:** Partner API: Get booking by reference
- **Auth:** X-API-Key (optional) or Bearer Token
- **Path Params:** `booking_reference` (string, required)
- **Response:** 200 - `BookingResponse`

---

## Partner Authentication

### POST `/api/v1/partners/auth/register`
- **Summary:** Register Partner
- **Description:** Self-service partner registration. Creates a new partner account with PENDING_VERIFICATION status. Sends verification email to the provided email address.
- **Auth:** None
- **Request Body:** `PartnerRegister`
- **Response:** 201 - `RegistrationResponse`

### GET `/api/v1/partners/auth/verify-email`
- **Summary:** Verify Email
- **Description:** Verify partner email address. Updates partner status from PENDING_VERIFICATION to PENDING_APPROVAL. Notifies admins of new partner application.
- **Auth:** None
- **Query Params:** `token` (string, required) - Email verification token
- **Response:** 200 - `EmailVerificationResponse`

### POST `/api/v1/partners/auth/login`
- **Summary:** Login Partner
- **Description:** Partner login. Authenticates partner and returns JWT tokens for dashboard access. Partner must be ACTIVE to login.
- **Auth:** None
- **Request Body:** `PartnerLogin`
- **Response:** 200 - `TokenResponse`

### POST `/api/v1/partners/auth/refresh`
- **Summary:** Refresh Token
- **Description:** Refresh access token. Uses refresh token to generate a new access token.
- **Auth:** None
- **Request Body:** `RefreshTokenRequest`
- **Response:** 200 - `TokenResponse`

### POST `/api/v1/partners/auth/forgot-password`
- **Summary:** Forgot Password
- **Description:** Request password reset. Sends password reset email if account exists.
- **Auth:** None
- **Request Body:** `ForgotPasswordRequest`
- **Response:** 200

### POST `/api/v1/partners/auth/reset-password`
- **Summary:** Reset Password
- **Description:** Reset password with token. Resets password using the token from forgot-password email.
- **Auth:** None
- **Request Body:** `ResetPasswordRequest`
- **Response:** 200

### PUT `/api/v1/partners/auth/change-password`
- **Summary:** Change Password
- **Description:** Change password (authenticated). Requires current password for verification.
- **Auth:** Bearer Token
- **Request Body:** `ChangePasswordRequest`
- **Response:** 200

---

## Operator Authentication

### POST `/api/v1/operators/auth/register`
- **Summary:** Register Operator
- **Description:** Self-service operator registration. Creates a new operator account with INACTIVE status pending email verification. Sends verification email to the provided email address.
- **Auth:** None
- **Request Body:** `OperatorRegister`
- **Response:** 201

### POST `/api/v1/operators/auth/verify-email`
- **Summary:** Verify Email
- **Description:** Verify operator email address. Updates operator and user status to verified and activates the operator account.
- **Auth:** None
- **Query Params:**
  - `email` (string, required)
  - `code` (string, required)
- **Response:** 200

### POST `/api/v1/operators/auth/login`
- **Summary:** Login Operator
- **Description:** Operator login. Authenticates operator and returns JWT tokens for dashboard access. Operator must be ACTIVE to login.
- **Auth:** None
- **Request Body:** `OperatorLogin`
- **Response:** 200 - `OperatorTokenResponse`

### POST `/api/v1/operators/auth/resend-verification`
- **Summary:** Resend Verification
- **Description:** Resend verification code
- **Auth:** None
- **Query Params:** `email` (string, required)
- **Response:** 200

### POST `/api/v1/operators/auth/forgot-password`
- **Summary:** Forgot Password
- **Description:** Request password reset
- **Auth:** None
- **Query Params:** `email` (string, required)
- **Response:** 200

### POST `/api/v1/operators/auth/reset-password`
- **Summary:** Reset Password
- **Description:** Reset password with code
- **Auth:** None
- **Query Params:**
  - `email` (string, required)
  - `code` (string, required)
  - `new_password` (string, required)
- **Response:** 200

---

## Admin

### GET `/api/v1/admin/partners`
- **Summary:** List All Partners
- **Description:** Get all partners with pagination (Admin only). Optional filtering by status.
- **Auth:** Bearer Token (Admin)
- **Query Params:**
  - `page` (integer, default: 1)
  - `page_size` (integer, default: 50)
  - `status_filter` (string, optional)
- **Response:** 200 - `PartnerListResponse`

### GET `/api/v1/admin/partners/pending`
- **Summary:** List Pending Partners
- **Description:** List pending partner applications. Returns partners with PENDING_APPROVAL status.
- **Auth:** Bearer Token (Admin)
- **Query Params:**
  - `skip` (integer, min: 0, default: 0)
  - `limit` (integer, min: 1, max: 100, default: 10)
- **Response:** 200 - Array of partner objects

### POST `/api/v1/admin/partners/{partner_id}/approve`
- **Summary:** Approve Partner
- **Description:** Approve or reject partner application. If approved: Updates status to ACTIVE, Generates API credentials, Sends welcome email. If rejected: Updates status to REJECTED, Sends rejection email.
- **Auth:** Bearer Token (Admin)
- **Path Params:** `partner_id` (string, required)
- **Request Body:** `PartnerApprovalRequest`
- **Response:** 200

### POST `/api/v1/admin/partners/{partner_id}/suspend`
- **Summary:** Suspend Partner
- **Description:** Suspend an active partner. Prevents partner from accessing the API.
- **Auth:** Bearer Token (Admin)
- **Path Params:** `partner_id` (string, required)
- **Query Params:** `reason` (string, required, minLength: 10, maxLength: 500)
- **Response:** 200

### POST `/api/v1/admin/partners/{partner_id}/activate`
- **Summary:** Activate Partner
- **Description:** Activate a suspended partner. Restores partner access to the API.
- **Auth:** Bearer Token (Admin)
- **Path Params:** `partner_id` (string, required)
- **Response:** 200

### GET `/api/v1/admin/waitlist`
- **Summary:** List Waitlist Members
- **Description:** Get all waitlist members with pagination (Admin only)
- **Auth:** Bearer Token (Admin)
- **Query Params:**
  - `page` (integer, default: 1)
  - `page_size` (integer, default: 50)
- **Response:** 200 - `WaitlistListResponse`

---

## Waitlist

### POST `/api/v1/waitlist/subscribe`
- **Summary:** Subscribe To Waitlist
- **Description:** Subscribe a user to the upcoming waitlist/newsletter by name and email. Idempotent: if the email already exists, returns the existing subscription with 200.
- **Auth:** None
- **Request Body:** `WaitlistSubscribeRequest`
- **Response:** 201 - `WaitlistSubscribeResponse`

---

## Partnerships

### POST `/partnerships/`
- **Summary:** Indicate Partnership Request
- **Auth:** None
- **Request Body:** `PartnershipRequest`
- **Response:** 201 - `PartnershipResponses`

---

## Questions

### POST `/api/v1/questions/`
- **Summary:** Submit Question
- **Description:** Accept a user's question and store it in the DB
- **Auth:** None
- **Request Body:** `QuestionRequest`
- **Response:** 201 - `QuestionResponse`

---

## Authentication Methods

### Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Used for:** User, Operator, Partner, and Admin authenticated endpoints

### X-API-Key
- **Header:** `X-API-Key: <api_key>`
- **Used for:** Partner API endpoints (alternative to Bearer Token)

### No Authentication
- Public endpoints that don't require authentication

---

## Notes

1. **Partner vs Operator APIs:**
   - `/api/v1/operators/*` - For operators managing routes, schedules, bookings
   - `/api/v1/partners/*` - For partners using the API to search and book for their customers

2. **Pagination:**
   - Most list endpoints support `skip` and `limit` parameters
   - Some use `page` and `page_size` instead

3. **Date Formats:**
   - Date: `YYYY-MM-DD`
   - DateTime: ISO 8601 format (e.g., `2024-12-20T12:00:00Z`)
   - Time: `HH:MM:SS`

4. **Currency:**
   - Default currency is `NGN` (Nigerian Naira)

5. **Transport Types:**
   - `flight` - Air travel
   - `bus` - Road transport
   - `train` - Rail transport

---

## Quick Reference by Use Case

### For Partner Portal Dashboard:
- **Dashboard Data:** `GET /api/v1/partners/me`
- **Bookings:** `GET /api/v1/partners/bookings` (if exists) or use operator endpoints
- **Schedules:** `GET /api/v1/operators/schedules`
- **Routes:** `GET /api/v1/operators/routes`
- **Payouts:** `GET /api/v1/operators/payouts`
- **Manifests:** `GET /api/v1/operators/schedules/{schedule_id}/manifest`
- **API Keys:** `GET /api/v1/partners/api-keys`
- **Usage Stats:** `GET /api/v1/partners/usage`
- **Webhooks:** `GET /api/v1/partners/webhooks`, `PUT /api/v1/partners/webhooks`

### For Partner API Integration:
- **Search:** `POST /api/v1/search`
- **Create Booking:** `POST /api/v1/bookings`
- **Get Booking:** `GET /api/v1/bookings/{booking_reference}`
- **API Keys:** `POST /api/v1/partners/api-keys`, `GET /api/v1/partners/api-keys`

---

**Last Updated:** Based on OpenAPI 3.1.0 specification


