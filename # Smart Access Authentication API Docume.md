# Smart Access Authentication API Documentation

## Base URL
```
http://localhost:8000/auth/
```

## ⚠️ **IMPORTANT UPDATE: OTP DISABLED**
**The OTP verification step has been temporarily disabled. Users now receive JWT tokens directly upon successful login.**

## Authentication Endpoints

### 1. Login (Updated - No OTP Required)
**Endpoint:** `POST /login`

**Description:** Authenticates user and directly returns JWT tokens (OTP verification bypassed)

**Request Body:**
```json
{
    "username": "admin123",
    "password": "securepassword123",
    "user_type": "administrator"
}
```

**Field Validation:**
- `username`: 3-50 characters, required
- `password`: minimum 8 characters, required
- `user_type`: "administrator" or "registration_officer"

**Success Response (200):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user_type": "administrator",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "admin123",
    "message": "Login successful."
}
```

**Error Responses:**
```json
// Invalid credentials (401)
{
    "detail": "Invalid credentials."
}

// Account locked (403)
{
    "detail": "Account is locked."
}

// Too many attempts (429)
{
    "detail": "Too many login attempts for this username. Try again in 10 minutes."
}
```

---

### 2. Verify OTP (Currently Unused)
**Endpoint:** `POST /verify-otp`

**⚠️ Status:** This endpoint is currently not used in the authentication flow but remains available for future implementation.

**Description:** Verifies OTP and returns JWT tokens

**Request Body:**
```json
{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "otp_code": "123456",
    "user_type": "administrator"
}
```

---

### 3. Resend OTP (Currently Unused)
**Endpoint:** `POST /resend-otp`

**⚠️ Status:** This endpoint is currently not used in the authentication flow but remains available for future implementation.

**Description:** Resends OTP for existing session

---

### 4. Create User (Registration Officer)
**Endpoint:** `POST /create-user`

**Description:** Administrators can create new users (registration officers or other administrators)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "username": "officer123",
    "full_name": "John Doe",
    "email": "officer@example.com",
    "phone_number": "+1234567890",
    "user_type": "registration_officer",
    "password": "securepassword123",
    "confirm_password": "securepassword123"
}
```

**Field Validation:**
- `username`: 3-50 characters, unique, required
- `full_name`: 255 characters max, required
- `email`: Valid email format, unique, required
- `phone_number`: Optional, 20 characters max
- `user_type`: "administrator" or "registration_officer", required
- `password`: minimum 8 characters, required
- `confirm_password`: Must match password, required

**Success Response (201):**
```json
{
    "message": "User created successfully.",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "officer123",
    "email": "officer@example.com"
}
```

**Error Responses:**
```json
// Not administrator (403)
{
    "detail": "Only administrators can create users."
}

// Username exists (400)
{
    "username": ["Username already exists"]
}

// Email exists (400)
{
    "email": ["Email already exists"]
}

// Password mismatch (400)
{
    "non_field_errors": ["Passwords do not match"]
}

// Validation errors (400)
{
    "username": ["This field is required."],
    "email": ["Enter a valid email address."],
    "password": ["Ensure this field has at least 8 characters."]
}
```

### **Complete Example: Creating a Registration Officer**

**Step 1: Login as Administrator**
```javascript
// Login first to get JWT token
const loginResponse = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: "admin123",
        password: "adminpassword",
        user_type: "administrator"
    })
});

const loginData = await loginResponse.json();
const accessToken = loginData.access;
```

**Step 2: Create Registration Officer**
```javascript
// Use the access token to create a new registration officer
const createUserResponse = await fetch('http://localhost:8000/auth/create-user', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: "officer001",
        full_name: "Jane Smith",
        email: "jane.smith@smartaccess.com",
        phone_number: "+1234567890",
        user_type: "registration_officer",
        password: "securePassword123",
        confirm_password: "securePassword123"
    })
});

const createUserData = await createUserResponse.json();
console.log(createUserData);
// Output: {
//   "message": "User created successfully.",
//   "user_id": "456e7890-e12b-34d5-a789-123456789abc",
//   "username": "officer001",
//   "email": "jane.smith@smartaccess.com"
// }
```

**Using cURL:**
```bash
# Step 1: Login as Administrator
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin123",
    "password": "adminpassword",
    "user_type": "administrator"
  }'

# Step 2: Create Registration Officer (replace YOUR_ACCESS_TOKEN)
curl -X POST http://localhost:8000/auth/create-user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "officer001",
    "full_name": "Jane Smith",
    "email": "jane.smith@smartaccess.com",
    "phone_number": "+1234567890",
    "user_type": "registration_officer",
    "password": "securePassword123",
    "confirm_password": "securePassword123"
  }'
```

---

### 5. Refresh Token
**Endpoint:** `POST /refresh`

**Description:** Refreshes access token using refresh token

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response (200):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Error Response (401):**
```json
{
    "detail": "Invalid refresh token."
}
```

---

### 6. Logout
**Endpoint:** `POST /logout`

**Description:** Logs out user and blacklists refresh token

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response (200):**
```json
{
    "message": "Successfully logged out."
}
```

**Error Response (400):**
```json
{
    "detail": "Invalid refresh token."
}
```

---

## Rate Limiting

### Login Endpoint
- **IP-based**: 5 attempts per 15 minutes
- **Username-based**: 3 attempts per 10 minutes

### OTP Verification (When Enabled)
- **IP-based**: 10 attempts per 10 minutes
- **Session-based**: 5 attempts per session

### Resend OTP (When Enabled)
- **IP-based**: 3 attempts per 5 minutes

**Rate Limit Response (429):**
```json
{
    "detail": "Too many attempts. Try again in 15 minutes."
}
```

---

## User Types

### Administrator
- Can create registration officers and other administrators
- Has account locking mechanism
- Tracks failed login attempts
- Access to all administrative functions
- Can manage security personnel (via administrator module)

### Registration Officer
- Can login and access assigned features
- Uses active/inactive status instead of account locking
- Limited permissions compared to administrators
- Cannot create other users

---

## **Updated Authentication Flow (OTP Disabled)**

1. **Login** → Get JWT tokens directly
2. **Use Access Token** → For authenticated requests
3. **Refresh Token** → When access token expires
4. **Logout** → Blacklist refresh token

### **Previous Flow (When OTP Was Enabled)**
~~1. Login → Get session_id~~
~~2. Check Email → Receive 6-digit OTP~~
~~3. Verify OTP → Get JWT tokens~~
~~4. Use Access Token → For authenticated requests~~
~~5. Refresh Token → When access token expires~~
~~6. Logout → Blacklist refresh token~~

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests

---

## **Updated Notes for Frontend Team**

1. **Simplified Login Flow**: No need to handle OTP verification step
2. **Direct Token Receipt**: JWT tokens are received immediately after successful login
3. **Store tokens securely** (localStorage/sessionStorage)
4. **Handle token expiration** gracefully
5. **Implement rate limiting feedback** to users
6. **Validate form inputs** before sending requests
7. **Handle network errors** appropriately
8. **Clear tokens on logout**

### **Frontend Implementation Example**

```javascript
// Login function (updated)
async function login(username, password, userType) {
    try {
        const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                user_type: userType
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Store tokens securely
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user_info', JSON.stringify({
                user_id: data.user_id,
                username: data.username,
                user_type: data.user_type
            }));

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            const error = await response.json();
            alert(error.detail);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

// Create Registration Officer function
async function createRegistrationOfficer(officerData) {
    try {
        const accessToken = localStorage.getItem('access_token');
        
        const response = await fetch('http://localhost:8000/auth/create-user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: officerData.username,
                full_name: officerData.fullName,
                email: officerData.email,
                phone_number: officerData.phoneNumber,
                user_type: "registration_officer",
                password: officerData.password,
                confirm_password: officerData.confirmPassword
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Registration officer created successfully!');
            return data;
        } else {
            const error = await response.json();
            console.error('Creation error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Create user error:', error);
        throw error;
    }
}

// Example usage
const newOfficer = {
    username: "officer001",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1234567890",
    password: "securePassword123",
    confirmPassword: "securePassword123"
};

createRegistrationOfficer(newOfficer)
    .then(result => console.log('Officer created:', result))
    .catch(error => console.error('Error:', error));
```

---

## **Validation Rules Summary**

### **CreateUserSerializer Validations:**

1. **Password Confirmation**: `password` must match `confirm_password`
2. **Username Uniqueness**: Username must be unique across all users
3. **Email Uniqueness**: Email must be unique across all users
4. **Password Length**: Minimum 8 characters
5. **Username Length**: 3-50 characters
6. **Required Fields**: username, full_name, email, user_type, password, confirm_password
7. **Optional Fields**: phone_number (max 20 characters)

### **User Types Available:**
- `"administrator"` - Full access to all features
- `"registration_officer"` - Limited access to assigned features

---

## **Deployment Changes**

### **Development Environment**
- **URL**: `http://localhost:8000`
- **Database**: PostgreSQL or SQLite
- **Debug Mode**: Enabled

### **Production Environment** 
- **URL**: TBD
- **Database**: PostgreSQL recommended
- **Debug Mode**: Disabled
- **HTTPS**: Required for JWT token security

---

## **Security Considerations**

1. **JWT Token Security**: Tokens contain user information and should be stored securely
2. **Rate Limiting**: Prevents brute force attacks
3. **Account Locking**: Administrators can be locked after failed attempts
4. **Password Requirements**: Minimum 8 characters
5. **Unique Constraints**: Username and email must be unique
6. **Permission Checks**: Only administrators can create new users
7. **Input Validation**: All inputs are validated on both frontend and backend

---

## **Related Modules**

### **Administrator Module**
- **Security Personnel Management**: Create, read, update, delete security personnel
- **Base URL**: `http://localhost:8000/api/administrator/`
- **Documentation**: See Administrator Module README

### **Future Modules**
- **Registration Module**: Handle visitor/student registrations
- **Access Control Module**: Manage physical access permissions

---

## **Re-enabling OTP (Future)**

When OTP needs to be re-enabled, the following changes should be made:

1. **Update LoginAPIView**: Remove direct JWT token generation, restore OTP generation and email sending
2. **Frontend**: Add OTP verification step back to the authentication flow
3. **Testing**: Ensure email configuration is working properly

---

This documentation reflects the current state of the authentication system with OTP disabled for faster development and testing.