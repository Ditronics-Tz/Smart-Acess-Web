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

**Description:** Logs out user and blacklists refresh token to prevent further use

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Field Validation:**
- `refresh`: Valid JWT refresh token string, required

**Success Response (200):**
```json
{
    "message": "Successfully logged out."
}
```

**Error Responses:**
```json
// Invalid refresh token (400)
{
    "detail": "Invalid refresh token."
}

// Authentication required (401)
{
    "detail": "Authentication credentials were not provided."
}

// Missing refresh token (400)
{
    "refresh": ["This field is required."]
}
```

### **Complete Logout Example**

**JavaScript Implementation:**
```javascript
// Logout function
async function logout() {
    try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!accessToken || !refreshToken) {
            console.error('No tokens found');
            // Clear any remaining tokens and redirect
            localStorage.clear();
            window.location.href = '/login';
            return;
        }

        const response = await fetch('http://localhost:8000/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message); // "Successfully logged out."
            
            // Clear all stored tokens and user data
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_info');
            
            // Redirect to login page
            window.location.href = '/login';
        } else {
            const error = await response.json();
            console.error('Logout error:', error);
            
            // Even if logout fails, clear local tokens
            localStorage.clear();
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Logout error:', error);
        
        // Clear tokens on any error
        localStorage.clear();
        window.location.href = '/login';
    }
}

// Example usage with logout button
document.getElementById('logout-btn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        logout();
    }
});
```

**Using cURL:**
```bash
# Logout (replace YOUR_ACCESS_TOKEN and YOUR_REFRESH_TOKEN)
curl -X POST http://localhost:8000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

### **Logout Implementation Details**

**Backend Process (LogoutAPIView):**
1. **Authentication Check**: Verifies user is authenticated via JWT access token
2. **Serializer Validation**: Uses `LogoutSerializer` to validate refresh token format
3. **Token Blacklisting**: Adds refresh token to blacklist to prevent reuse
4. **Response**: Returns success message or error details

**Frontend Best Practices:**
1. **Always clear local storage** even if logout request fails
2. **Redirect to login page** after logout
3. **Handle network errors** gracefully
4. **Confirm logout action** with user before proceeding
5. **Clear all user-related data** including tokens and user info

### **Security Features**

1. **Token Blacklisting**: Refresh tokens are permanently blacklisted after logout
2. **Authentication Required**: Must provide valid access token to logout
3. **Prevents Token Reuse**: Blacklisted tokens cannot be used for new access tokens
4. **Immediate Invalidation**: Tokens become invalid immediately after logout

### **Error Handling Examples**

```javascript
// Enhanced logout with proper error handling
async function logoutWithErrorHandling() {
    try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        
        // Check if tokens exist
        if (!accessToken || !refreshToken) {
            throw new Error('No authentication tokens found');
        }

        const response = await fetch('http://localhost:8000/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Successful logout
            console.log('✅ Logout successful:', data.message);
            clearUserSession();
            redirectToLogin();
        } else {
            // Handle specific error cases
            if (response.status === 401) {
                console.warn('⚠️ Authentication expired, clearing session');
            } else if (response.status === 400) {
                console.warn('⚠️ Invalid refresh token, clearing session');
            } else {
                console.error('❌ Logout failed:', data.detail);
            }
            
            // Clear session even on error
            clearUserSession();
            redirectToLogin();
        }
    } catch (error) {
        console.error('❌ Network error during logout:', error.message);
        
        // Clear tokens on any error
        clearUserSession();
        redirectToLogin();
    }
}

function clearUserSession() {
    // Clear all authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    
    // Clear any cached user data
    sessionStorage.clear();
}

function redirectToLogin() {
    // Add a slight delay to ensure storage is cleared
    setTimeout(() => {
        window.location.href = '/login';
    }, 100);
}
```

### **Integration with Authentication Flow**

```javascript
// Complete authentication flow with logout
class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:8000/auth';
    }
    
    async login(username, password, userType) {
        // Login implementation...
    }
    
    async logout() {
        const tokens = this.getTokens();
        
        if (!tokens.access || !tokens.refresh) {
            this.clearSession();
            return;
        }
        
        try {
            await fetch(`${this.baseURL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh: tokens.refresh
                })
            });
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            // Always clear session regardless of request result
            this.clearSession();
        }
    }
    
    getTokens() {
        return {
            access: localStorage.getItem('access_token'),
            refresh: localStorage.getItem('refresh_token')
        };
    }
    
    clearSession() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        window.location.href = '/login';
    }
    
    isAuthenticated() {
        const tokens = this.getTokens();
        return !!(tokens.access && tokens.refresh);
    }
}

// Usage
const auth = new AuthService();

// Logout button handler
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.logout();
});
```

### **Related Token Management**

The logout endpoint works in conjunction with other token-related endpoints:

- **Refresh Token** (`POST /refresh`): Used to get new access tokens
- **Login** (`POST /login`): Issues new token pairs
- **Logout** (`POST /logout`): Invalidates refresh tokens

After logout, users must login again to get new tokens.