# Organizer Event Flow Test Script
# Requires server running on localhost:5000
# Uses a pre-existing organizer from the database

$BASE_URL = "http://localhost:5000"

# Helper function to make requests
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Token,
        [hashtable]$Body,
        [string]$ImagePath
    )
    
    $url = "$BASE_URL$Endpoint"
    $headers = @{"Authorization" = "Bearer $Token"}
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        if ($ImagePath -and (Test-Path $ImagePath)) {
            # Multipart form for image upload
            Write-Host "📤 Uploading image from: $ImagePath"
            $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $headers -Form @{image = (Get-Item $ImagePath)}
        } elseif ($Body) {
            # JSON body
            $headers["Content-Type"] = "application/json"
            $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $headers -Body ($Body | ConvertTo-Json -Depth 10)
        } else {
            # No body
            $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $headers
        }
        
        return $response.Content | ConvertFrom-Json
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $body = $reader.ReadToEnd()
            Write-Host "Response: $body" -ForegroundColor Red
        }
        return $null
    }
}

Write-Host "🚀 Organizer Event Flow Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Step 1: Register/Login as Organizer (you should already have a token or do this step)
Write-Host "`n1️⃣ Assuming organizer is logged in. Using token from environment or hardcode it here."
$token = Read-Host "Enter organizer JWT token (or press Enter to skip)"

if (-not $token) {
    Write-Host "⚠️  Skipping tests without token. To test, provide a valid organizer token."
    exit
}

# Step 2: Upload an image
Write-Host "`n2️⃣ Uploading event image..."
$imagePath = "$PSScriptRoot\sample-event.jpg"
if (-not (Test-Path $imagePath)) {
    Write-Host "⚠️  No sample image found at $imagePath. Creating a minimal placeholder image..."
    # Create a minimal valid JPEG (1x1 pixel)
    $jpegBytes = @(
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
        0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20,
        0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
        0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
        0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
        0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D, 0x01, 0x02, 0x03, 0x00,
        0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32,
        0x81, 0x91, 0xA1, 0x08, 0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
        0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x34, 0x35,
        0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55,
        0x56, 0x57, 0x58, 0x59, 0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
        0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8A, 0x92, 0x93, 0x94,
        0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2,
        0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
        0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6,
        0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA,
        0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD0, 0xFF, 0xD9
    )
    [System.IO.File]::WriteAllBytes($imagePath, [byte[]]$jpegBytes)
    Write-Host "✅ Created placeholder image."
}

$uploadResult = Invoke-ApiRequest -Method "POST" -Endpoint "/organizer/events/upload-image" -Token $token -ImagePath $imagePath
if ($uploadResult) {
    Write-Host "✅ Image uploaded successfully" -ForegroundColor Green
    Write-Host "   URL: $($uploadResult.url)"
    Write-Host "   PublicId: $($uploadResult.publicId)"
    $imageUrl = $uploadResult.url
    $publicId = $uploadResult.publicId
} else {
    Write-Host "❌ Image upload failed. Exiting." -ForegroundColor Red
    exit
}

# Step 3: Create event with the uploaded image
Write-Host "`n3️⃣ Creating event with uploaded image..."
$eventData = @{
    title = "Tech Workshop 2025"
    description = "Learn modern web development with React and Node.js"
    images = @(
        @{
            url = $imageUrl
            publicId = $publicId
        }
    )
    city = "Jaipur"
    location = @{
        type = "Point"
        coordinates = @(75.79, 26.92)
    }
    address = "Innovation Hub, Jaipur"
    startTime = "2025-12-15T09:00:00Z"
    endTime = "2025-12-15T17:00:00Z"
    capacity = 50
    enrollmentFee = 500
    category = "Workshop"
    tags = @("Tech", "Web Development")
    status = "published"
}

$createResult = Invoke-ApiRequest -Method "POST" -Endpoint "/organizer/events" -Token $token -Body $eventData
if ($createResult) {
    Write-Host "✅ Event created successfully" -ForegroundColor Green
    $eventId = $createResult.event._id
    Write-Host "   Event ID: $eventId"
    Write-Host "   Title: $($createResult.event.title)"
} else {
    Write-Host "❌ Event creation failed. Exiting." -ForegroundColor Red
    exit
}

# Step 4: Get event details
Write-Host "`n4️⃣ Fetching event details..."
$getResult = Invoke-ApiRequest -Method "GET" -Endpoint "/organizer/events/$eventId" -Token $token
if ($getResult) {
    Write-Host "✅ Event retrieved successfully" -ForegroundColor Green
    Write-Host "   Title: $($getResult.event.title)"
    Write-Host "   Capacity: $($getResult.event.capacity)"
    Write-Host "   Enrolled: $($getResult.enrolledCount)"
    Write-Host "   Available: $($getResult.availableSeats)"
    Write-Host "   Images: $($getResult.event.images.Count)"
} else {
    Write-Host "❌ Event retrieval failed." -ForegroundColor Red
}

# Step 5: Update event
Write-Host "`n5️⃣ Updating event..."
$updateData = @{
    title = "Tech Workshop 2025 - Advanced Edition"
    capacity = 100
    enrollmentFee = 750
}
$updateResult = Invoke-ApiRequest -Method "PUT" -Endpoint "/organizer/events/$eventId" -Token $token -Body $updateData
if ($updateResult) {
    Write-Host "✅ Event updated successfully" -ForegroundColor Green
    Write-Host "   New Title: $($updateResult.event.title)"
    Write-Host "   New Capacity: $($updateResult.event.capacity)"
    Write-Host "   New Fee: $($updateResult.event.enrollmentFee)"
} else {
    Write-Host "❌ Event update failed." -ForegroundColor Red
}

# Step 6: Get organizer's events list
Write-Host "`n6️⃣ Fetching organizer's events..."
$listResult = Invoke-ApiRequest -Method "GET" -Endpoint "/organizer/events?page=1&limit=10" -Token $token
if ($listResult) {
    Write-Host "✅ Events retrieved" -ForegroundColor Green
    Write-Host "   Total events: $($listResult.total)"
    Write-Host "   Page $($listResult.page) of $(([Math]::Ceiling($listResult.total / $listResult.limit)))"
} else {
    Write-Host "❌ Events list fetch failed." -ForegroundColor Red
}

# Step 7: Delete event (also deletes images from Cloudinary)
Write-Host "`n7️⃣ Deleting event..."
$deleteResult = Invoke-ApiRequest -Method "DELETE" -Endpoint "/organizer/events/$eventId" -Token $token
if ($deleteResult) {
    Write-Host "✅ Event deleted successfully" -ForegroundColor Green
    Write-Host "   Message: $($deleteResult.message)"
    Write-Host "   (All associated images also deleted from Cloudinary)"
} else {
    Write-Host "❌ Event deletion failed." -ForegroundColor Red
}

Write-Host "`n✨ Test completed!" -ForegroundColor Cyan
