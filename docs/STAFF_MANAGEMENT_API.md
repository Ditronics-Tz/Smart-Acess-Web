# Staff Management API Documentation

## Overview
The Staff Management API provides comprehensive CRUD operations for managing staff members in the Smart Access system. It includes features for staff registration, profile management, CSV import/export, photo uploads, and access control.

## Base URL
```
/api/staff/
```

## Authentication & Permissions

### User Types
- **Administrator**: Full CRUD access to all staff operations
- **Registration Officer**: Can view, create staff, and upload CSV files (no update/delete)

### Permission Classes
- `CanManageStaff`: Allows administrators and registration officers appropriate access
- `IsAdministrator`: Restricts operations to administrators only

## Endpoints

### 1. List Staff
**GET** `/api/staff/`

**Permissions**: Administrators, Registration Officers

**Query Parameters**:
- `page`: Page number for pagination
- `page_size`: Number of records per page (default: 20)
- `search`: Search in staff_number, first_name, surname, department, position
- `department`: Filter by department
- `employment_status`: Filter by employment status
- `is_active`: Filter by active status
- `ordering`: Sort by fields (created_at, surname, staff_number)

**Response**:
```json
{
    "count": 150,
    "next": "http://localhost:8000/api/staff/?page=2",
    "previous": null,
    "results": [
        {
            "staff_uuid": "uuid-string",
            "surname": "Doe",
            "first_name": "John",
            "middle_name": null,
            "mobile_phone": "+255123456789",
            "staff_number": "STF001",
            "department": "IT Department",
            "position": "System Administrator",
            "employment_status": "Active",
            "is_active": true,
            "created_at": "2025-01-15T10:30:00Z",
            "updated_at": "2025-01-15T10:30:00Z"
        }
    ],
    "summary": {
        "total_staff": 150,
        "active_staff": 145,
        "inactive_staff": 5
    },
    "user_permissions": {
        "current_user": "admin",
        "user_type": "administrator",
        "can_create": true,
        "can_modify": true,
        "can_delete": true
    }
}
```

### 2. Get Staff Details
**GET** `/api/staff/{staff_uuid}/`

**Permissions**: Administrators, Registration Officers

**Response**:
```json
{
    "staff_uuid": "uuid-string",
    "surname": "Doe",
    "first_name": "John",
    "middle_name": null,
    "mobile_phone": "+255123456789",
    "staff_number": "STF001",
    "department": "IT Department",
    "position": "System Administrator",
    "employment_status": "Active",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "user_permissions": {
        "can_modify": true,
        "can_delete": true
    }
}
```

### 3. Create Staff
**POST** `/api/staff/`

**Permissions**: Administrators, Registration Officers

**Request Body**:
```json
{
    "surname": "Doe",
    "first_name": "John",
    "middle_name": "Smith",
    "mobile_phone": "+255123456789",
    "staff_number": "STF001",
    "department": "IT Department",
    "position": "System Administrator",
    "employment_status": "Active"
}
```

**Response** (201 Created):
```json
{
    "staff_uuid": "uuid-string",
    "surname": "Doe",
    "first_name": "John",
    "middle_name": "Smith",
    "mobile_phone": "+255123456789",
    "staff_number": "STF001",
    "department": "IT Department",
    "position": "System Administrator",
    "employment_status": "Active",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "created_by": {
        "username": "admin",
        "user_type": "administrator",
        "full_name": "Administrator"
    }
}
```

### 4. Update Staff
**PUT/PATCH** `/api/staff/{staff_uuid}/`

**Permissions**: Administrators only

**Request Body** (PATCH example):
```json
{
    "position": "Senior System Administrator",
    "department": "IT Operations"
}
```

### 5. Delete Staff
**DELETE** `/api/staff/{staff_uuid}/`

**Permissions**: Administrators only

**Response**: 204 No Content

### 6. CSV Upload
**POST** `/api/staff/upload-csv/`

**Permissions**: Administrators, Registration Officers

**Content-Type**: `multipart/form-data`

**Request Body**:
- `csv_file`: CSV file containing staff data

**Expected CSV Format**:
```csv
Your Staff Number:,Your Surname:,Your First_Name:,Your Middle_Name,Your Active Mobile Phone number:,Your Department,Your Position,Your Employment Status
STF001,Doe,John,Michael,+255712345678,Computer Engineering,Lecturer,Active
STF002,Smith,Jane,,+255712345679,Information Technology,System Administrator,Active
```

**Required CSV Columns**:
- `Your Staff Number:` (must be unique)
- `Your Surname:`
- `Your First_Name:`
- `Your Department`
- `Your Position`

**Optional CSV Columns**:
- `Your Middle_Name`
- `Your Active Mobile Phone number:`
- `Your Employment Status` (defaults to "Active" if not provided)

**Response** (201 Created):
```json
{
    "success": true,
    "message": "Successfully created 2 staff members, skipped 0 problematic records",
    "data": {
        "total_created": 2,
        "total_skipped": 0,
        "skipped_records": [],
        "staff_members": [
            {
                "staff_uuid": "uuid-string",
                "surname": "Doe",
                "first_name": "John",
                "middle_name": "Michael",
                "mobile_phone": "+255712345678",
                "staff_number": "STF001",
                "department": "Computer Engineering",
                "position": "Lecturer",
                "employment_status": "Active",
                "is_active": true,
                "created_at": "2025-01-15T10:30:00Z",
                "updated_at": "2025-01-15T10:30:00Z"
            }
        ],
        "uploaded_by": {
            "username": "admin",
            "user_type": "administrator",
            "full_name": "Administrator",
            "upload_timestamp": "2025-01-15T10:30:00Z"
        }
    }
}
```

**Error Response** (400 Bad Request):
```json
{
    "success": false,
    "message": "CSV validation failed",
    "errors": "Missing required columns: surname, first_name"
}
```

### 7. CSV Template Download
**GET** `/api/staff/csv-template/`

**Permissions**: Administrators, Registration Officers

**Response**: CSV file download with template format

**Example CSV Template**:
```csv
Your Staff Number:,Your Surname:,Your First_Name:,Your Middle_Name,Your Active Mobile Phone number:,Your Department,Your Position,Your Employment Status
STF001,Doe,John,Michael,+255712345678,Computer Engineering,Lecturer,Active
```

### 8. Upload Staff Photo
**POST** `/api/staff/{staff_uuid}/upload-photo/`

**Permissions**: Administrators, Registration Officers

**Content-Type**: `multipart/form-data`

**Request Body**:
- `photo`: Image file (JPEG, PNG, max 5MB)

**Response** (201 Created):
```json
{
    "success": true,
    "message": "Photo uploaded successfully",
    "data": {
        "staff_uuid": "uuid-string",
        "staff_number": "STF001",
        "photo_url": "http://localhost:8000/media/staff_photos/uuid-string.jpg",
        "uploaded_at": "2025-01-15T10:30:00Z",
        "uploaded_by": {
            "username": "admin",
            "user_type": "administrator",
            "full_name": "Administrator"
        }
    }
}
```

**Error Responses**:
- **400 Bad Request**: Invalid file type or size
- **404 Not Found**: Staff member not found

### 9. Validation Info
**GET** `/api/staff/validation-info/`

**Permissions**: Administrators, Registration Officers

**Response**:
```json
{
    "required_fields": [
        "surname",
        "first_name",
        "staff_number",
        "department",
        "position"
    ],
    "optional_fields": [
        "middle_name",
        "mobile_phone",
        "employment_status"
    ],
    "employment_status_choices": [
        "Active",
        "Inactive",
        "Terminated",
        "Retired",
        "On Leave"
    ],
    "file_requirements": {
        "format": "CSV",
        "max_size": "5MB",
        "encoding": "UTF-8"
    },
    "validation_rules": {
        "staff_number": "Must be unique across all staff members",
        "mobile_phone": "Optional. Maximum 15 characters for phone number",
        "employment_status": "Must be one of the valid choices if provided. Defaults to \"Active\"",
        "department": "Required field",
        "position": "Required field"
    },
    "user_permissions": {
        "current_user": "admin",
        "user_type": "administrator",
        "can_create": true,
        "can_upload_csv": true,
        "can_download_template": true,
        "can_upload_photos": true,
        "can_modify": true,
        "can_delete": true
    }
}
```

## Data Models

### Staff Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `staff_uuid` | UUID | Auto | Unique identifier |
| `surname` | String(100) | Yes | Staff surname |
| `first_name` | String(100) | Yes | Staff first name |
| `middle_name` | String(100) | No | Staff middle name |
| `mobile_phone` | String(15) | No | Mobile phone number |
| `staff_number` | String(20) | Yes | Unique staff number |
| `department` | String(255) | Yes | Department name |
| `position` | String(100) | Yes | Job position |
| `employment_status` | Choice | No | Active/Inactive/Terminated/Retired/On Leave |
| `is_active` | Boolean | Auto | Active status |
| `created_at` | DateTime | Auto | Creation timestamp |
| `updated_at` | DateTime | Auto | Last update timestamp |

### Employment Status Choices
- `Active`: Currently employed
- `Inactive`: Temporarily inactive
- `Terminated`: Employment terminated
- `Retired`: Retired
- `On Leave`: Currently on leave

### Staff Photo Model Fields

| Field | Type | Description |
|-------|------|-------------|
| `staff` | OneToOneField | Reference to Staff model |
| `photo` | ImageField | Photo file (stored in media/staff_photos/) |
| `uploaded_at` | DateTime | Upload timestamp |

## Filtering & Search

### Search Fields
- `staff_number`
- `first_name`
- `surname`
- `department`
- `position`

### Filter Fields
- `department`: Exact match
- `employment_status`: Exact match
- `is_active`: Boolean filter

### Ordering Fields
- `created_at`
- `surname`
- `staff_number`

## Error Responses

### 400 Bad Request
```json
{
    "staff_number": ["This field must be unique."],
    "mobile_phone": ["Ensure this field has no more than 15 characters."]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

## Usage Examples

### Create a New Staff Member
```bash
curl -X POST http://localhost:8000/api/staff/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "surname": "Johnson",
    "first_name": "Sarah",
    "staff_number": "STF002",
    "department": "Human Resources",
    "position": "HR Manager"
  }'
```

### Search Staff by Department
```bash
curl -X GET "http://localhost:8000/api/staff/?department=IT%20Department" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Staff Validation Info
```bash
curl -X GET http://localhost:8000/api/staff/validation-info/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- All timestamps are in UTC (ISO 8601 format)
- Staff numbers must be unique across the system
- The API uses UUIDs for staff identification
- Soft deletes are not implemented (use `is_active` field instead)
- CSV upload functionality is fully implemented with validation and error handling
- Photo upload functionality allows JPEG and PNG images up to 5MB
- All operations are logged for audit purposes
- Staff can be created without photos and photos can be added later