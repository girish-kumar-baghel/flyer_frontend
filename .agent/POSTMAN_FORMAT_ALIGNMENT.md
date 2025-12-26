# Order Request Format - Postman Alignment

## 🎯 Objective
Ensure the order creation request from the success handler matches **EXACTLY** the Postman format that is known to work.

---

## 📋 Postman Request Format (Working Example)

### **Request Details**
- **Method**: POST
- **URL**: `http://193.203.161.174:3007/api/orders`
- **Content-Type**: `multipart/form-data`

### **Form Fields (in exact order)**

```javascript
{
  // Event Details
  'presenting': 'DJ Night Presents',
  'event_title': 'Summer Blast 2026',
  'event_date': '2025-12-16',
  'address_phone': 'E11EVEN Miami | +1 305-555-0187',
  'flyer_info': '21+ | VIP Tables Available',
  'custom_notes': 'Make it neon and luxury theme',
  'delivery_time': '5 Hours',
  
  // User Info
  'email': 'test@gmail.com',
  'web_user_id': 'd91e9478-6051-700c-0905-11c127c00352',
  
  // Product Info
  'flyer_is': '26',
  'total_price': '149.99',
  
  // Boolean Options (as strings)
  'story_size_version': 'true',
  'custom_flyer': 'true',
  'animated_flyer': 'true',
  'instagram_post_size': 'true',
  
  // JSON Arrays/Objects (as JSON strings)
  'djs': '[{"name":"DJ Snake"},{"name":"Tiësto"}]',
  'host': '{"name":"E11EVEN Miami"}',
  'sponsors': '[{"name":"Red Bull"},{"name":"Grey Goose"}]',
  
  // File Uploads
  'venue_logo': <File>,
  'host_file': <File>,
  'dj_0': <File>,
  'dj_1': <File>,
  'sponsor_0': <File>,
  'sponsor_1': <File>
}
```

### **Expected Response**

```json
{
  "message": "Order created successfully!",
  "order": {
    "id": 17,
    "presenting": "DJ Night Presents",
    "event_title": "Summer Blast 2026",
    "event_date": "2025-12-16T00:00:00.000Z",
    "flyer_info": "21+ | VIP Tables Available",
    "address_phone": "E11EVEN Miami | +1 305-555-0187",
    "venue_logo": "/uploads/venue_logo/venue_17.jpg",
    "djs": [
      {
        "name": "DJ Snake",
        "image": "/uploads/djs/dj_1_17.png"
      },
      {
        "name": "Tiësto",
        "image": "/uploads/djs/dj_2_17.png"
      }
    ],
    "host": {
      "name": "E11EVEN Miami",
      "image": "/uploads/host/host_17.png"
    },
    "sponsors": [
      {
        "name": null,
        "image": "/uploads/sponsors/sponsor_1_17.png"
      },
      {
        "name": null,
        "image": "/uploads/sponsors/sponsor_2_17.png"
      }
    ],
    "story_size_version": 1,
    "custom_flyer": 1,
    "animated_flyer": 1,
    "instagram_post_size": 1,
    "delivery_time": "5 Hours",
    "custom_notes": "Make it neon and luxury theme",
    "flyer_is": 26,
    "total_price": "149.99",
    "status": "pending",
    "email": "test@gmail.com",
    "web_user_id": "google_114455667788990011223",
    "created_at": "2025-12-16T06:51:07.000Z",
    "updated_at": "2025-12-16T06:51:07.000Z"
  }
}
```

---

## ❌ Previous Implementation Issues

### **Fields That Were Included But NOT in Postman**

1. ❌ `category_id` - Not in Postman request
2. ❌ `user_id` - Not in Postman request (only `web_user_id`)
3. ❌ `subtotal` - Not in Postman request
4. ❌ `image_url` - Not in Postman request

### **Field Order Issues**

The previous implementation didn't maintain the exact field order, which could potentially cause issues with some backend parsers.

### **Missing Files**

Files (`venue_logo`, `host_file`, `dj_0`, etc.) were not being sent because they're not stored in Stripe metadata.

---

## ✅ Updated Implementation

### **File**: `app/api/checkout/success/route.ts`

```typescript
// Create FormData matching EXACT Postman format
const formData = new FormData()

// Add fields in the EXACT order as Postman
formData.append('presenting', formDataObj.presenting || '')
formData.append('event_title', formDataObj.event_title || '')
formData.append('event_date', formDataObj.event_date || '')
formData.append('address_phone', formDataObj.address_phone || '')
formData.append('flyer_info', formDataObj.flyer_info || '')
formData.append('custom_notes', formDataObj.custom_notes || '')
formData.append('delivery_time', formDataObj.delivery_time || '24 hours')
formData.append('email', formDataObj.email || orderData.userEmail || 'user@example.com')
formData.append('web_user_id', formDataObj.user_id || orderData.userId || '')

const flyerId = formDataObj.flyer_id || formDataObj.flyer_is || '26';
formData.append('flyer_is', flyerId.toString())
formData.append('total_price', (formDataObj.total_price || 0).toString())

// Boolean fields as strings (matching Postman format)
formData.append('story_size_version', (formDataObj.story_size_version || false).toString())
formData.append('custom_flyer', (formDataObj.custom_flyer || false).toString())
formData.append('animated_flyer', (formDataObj.animated_flyer || false).toString())
formData.append('instagram_post_size', (formDataObj.instagram_post_size || true).toString())

// JSON fields (matching Postman format exactly)
formData.append('djs', JSON.stringify(formDataObj.djs || []))
formData.append('host', JSON.stringify(formDataObj.host || {}))
formData.append('sponsors', JSON.stringify(formDataObj.sponsors || []))

// Note: Files are NOT included (not stored in Stripe metadata)
```

---

## 📊 Field Comparison Table

| Field Name | Postman | Previous Code | Updated Code | Notes |
|------------|---------|---------------|--------------|-------|
| `presenting` | ✅ | ✅ | ✅ | Event presenter |
| `event_title` | ✅ | ✅ | ✅ | Event name |
| `event_date` | ✅ | ✅ | ✅ | Date in YYYY-MM-DD format |
| `address_phone` | ✅ | ✅ | ✅ | Venue address & phone |
| `flyer_info` | ✅ | ✅ | ✅ | Event info (age, dress code, etc.) |
| `custom_notes` | ✅ | ✅ | ✅ | Designer notes |
| `delivery_time` | ✅ | ✅ | ✅ | Delivery timeframe |
| `email` | ✅ | ✅ | ✅ | User email |
| `web_user_id` | ✅ | ✅ | ✅ | User ID from auth |
| `flyer_is` | ✅ | ✅ | ✅ | Flyer template ID |
| `total_price` | ✅ | ✅ | ✅ | Total order price |
| `story_size_version` | ✅ | ✅ | ✅ | Instagram story size option |
| `custom_flyer` | ✅ | ✅ | ✅ | Custom design option |
| `animated_flyer` | ✅ | ✅ | ✅ | Animation option |
| `instagram_post_size` | ✅ | ✅ | ✅ | Instagram post size option |
| `djs` | ✅ | ✅ | ✅ | DJ array (JSON string) |
| `host` | ✅ | ✅ | ✅ | Host object (JSON string) |
| `sponsors` | ✅ | ✅ | ✅ | Sponsors array (JSON string) |
| `venue_logo` | ✅ | ❌ | ❌ | File - not in metadata |
| `host_file` | ✅ | ❌ | ❌ | File - not in metadata |
| `dj_0` | ✅ | ❌ | ❌ | File - not in metadata |
| `dj_1` | ✅ | ❌ | ❌ | File - not in metadata |
| `sponsor_0` | ✅ | ❌ | ❌ | File - not in metadata |
| `sponsor_1` | ✅ | ❌ | ❌ | File - not in metadata |
| `category_id` | ❌ | ✅ | ❌ | **REMOVED** - not in Postman |
| `user_id` | ❌ | ✅ | ❌ | **REMOVED** - not in Postman |
| `subtotal` | ❌ | ✅ | ❌ | **REMOVED** - not in Postman |
| `image_url` | ❌ | ✅ | ❌ | **REMOVED** - not in Postman |

---

## 🔧 Changes Made

### **1. Removed Unnecessary Fields**

```diff
- formData.append('category_id', (formDataObj.category_id || 1).toString())
- formData.append('user_id', formDataObj.user_id || orderData.userId || '')
- formData.append('subtotal', (formDataObj.subtotal || 0).toString())
- formData.append('image_url', formDataObj.image_url || '')
```

These fields were **NOT** in the working Postman request, so they've been removed.

### **2. Reordered Fields to Match Postman**

Fields are now appended in the **exact same order** as the Postman request:
1. Event details first
2. User info
3. Product info
4. Boolean options
5. JSON data

### **3. Updated Default Values**

```diff
- const flyerId = formDataObj.flyer_id || formDataObj.flyer_is || 1;
+ const flyerId = formDataObj.flyer_id || formDataObj.flyer_is || '26';
```

Changed default flyer ID to match Postman example.

### **4. Added Documentation**

Added clear comments explaining:
- Why files are not included
- Field order matches Postman
- Data format expectations

---

## 🚨 Known Limitations

### **File Uploads Not Supported**

**Issue**: Files cannot be stored in Stripe metadata due to size limitations.

**Current Behavior**: 
- Files are **NOT** sent with the order creation request
- Order is created without images
- Backend may use default images or leave fields empty

**Recommended Solutions**:

#### **Option 1: Pre-upload Files to Cloud Storage**

```typescript
// Before creating Stripe session
const uploadedFiles = {
  venue_logo: await uploadToS3(venueLogo),
  host_file: await uploadToS3(hostFile),
  dj_0: await uploadToS3(djFiles[0]),
  // ... etc
}

// Store URLs in order data
orderData.fileUrls = uploadedFiles
```

Then in success handler:
```typescript
// Download files from URLs and attach to FormData
if (formDataObj.fileUrls?.venue_logo) {
  const file = await fetchFileFromUrl(formDataObj.fileUrls.venue_logo)
  formData.append('venue_logo', file)
}
```

#### **Option 2: Separate File Upload After Order Creation**

```typescript
// 1. Create order without files
const order = await createOrder(formData)

// 2. Upload files separately
await uploadOrderFiles(order.id, {
  venue_logo: venueLogoFile,
  host_file: hostFile,
  // ... etc
})
```

#### **Option 3: Store Files Before Checkout**

```typescript
// In the form submission, before Stripe checkout
const fileIds = await storeTemporaryFiles({
  venue_logo: venueLogo,
  host_file: hostFile,
  // ... etc
})

// Store file IDs in Stripe metadata
orderData.fileIds = fileIds

// In success handler, retrieve files by ID
const files = await retrieveTemporaryFiles(formDataObj.fileIds)
formData.append('venue_logo', files.venue_logo)
```

---

## 📝 Testing Checklist

### **Before Testing**

- [ ] Ensure Stripe publishable and secret keys are set
- [ ] Backend API is accessible at `http://193.203.161.174:3007`
- [ ] Test user account exists

### **Test Scenarios**

#### **Scenario 1: Basic Order (No Files)**

**Input**:
```json
{
  "presenting": "Test Event",
  "event_title": "Test Party",
  "event_date": "2025-12-20",
  "address_phone": "123 Test St | +1 555-0100",
  "flyer_info": "21+ | Test Info",
  "custom_notes": "Test notes",
  "delivery_time": "24 hours",
  "email": "test@example.com",
  "web_user_id": "test-user-123",
  "flyer_is": "26",
  "total_price": "10.00",
  "story_size_version": "false",
  "custom_flyer": "false",
  "animated_flyer": "false",
  "instagram_post_size": "true",
  "djs": [{"name": "Test DJ"}],
  "host": {"name": "Test Host"},
  "sponsors": []
}
```

**Expected**: Order created successfully with all fields populated

#### **Scenario 2: Order with All Options**

**Input**: All boolean options set to `true`, multiple DJs, host, and sponsors

**Expected**: Order created with all extras enabled

#### **Scenario 3: Minimal Order**

**Input**: Only required fields (presenting, event_title, event_date, email, web_user_id, flyer_is, total_price)

**Expected**: Order created with defaults for optional fields

### **Verification Steps**

1. **Check Request Logs**:
   ```
   console.log('📤 Submitting order to backend API...')
   console.log('📋 Order details:', { ... })
   ```

2. **Verify Response**:
   - Status code: 200
   - Response contains `order.id`
   - All submitted fields are in response

3. **Check Backend Database**:
   - Order record exists
   - All fields match submitted data
   - Status is "pending"

4. **Verify Thank You Page**:
   - Redirects to `/thank-you?orderId=XXX`
   - Order ID is displayed
   - No error messages

---

## 🔍 Debugging Guide

### **Common Issues**

#### **Issue 1: Order Not Created**

**Symptoms**: Success handler runs but no order in database

**Debug Steps**:
1. Check console logs for API response
2. Verify backend API is accessible
3. Check if all required fields are present
4. Verify FormData is being sent correctly

**Solution**:
```typescript
// Add detailed logging
console.log('FormData entries:')
for (let [key, value] of formData.entries()) {
  console.log(`  ${key}: ${value}`)
}
```

#### **Issue 2: Missing Fields in Order**

**Symptoms**: Order created but some fields are null/empty

**Debug Steps**:
1. Check if fields are in Stripe metadata
2. Verify field names match exactly
3. Check for typos in field names

**Solution**: Compare field names with Postman request exactly

#### **Issue 3: Payment Verified But Order Fails**

**Symptoms**: Payment successful, but order creation fails

**Debug Steps**:
1. Check backend API logs
2. Verify backend API is running
3. Check for network issues
4. Verify FormData format

**Solution**: Implement retry logic or webhook fallback

---

## 🎯 Summary

### **What Changed**

✅ **Removed** fields not in Postman: `category_id`, `user_id`, `subtotal`, `image_url`  
✅ **Reordered** fields to match Postman exactly  
✅ **Updated** default values to match Postman  
✅ **Added** documentation and comments  
✅ **Maintained** exact field naming and format  

### **What's Still Missing**

⚠️ **File uploads** - Not supported via Stripe metadata  
⚠️ **File handling** - Needs separate implementation  

### **Next Steps**

1. **Test** the updated implementation with real payment
2. **Implement** file upload solution (choose from options above)
3. **Add** webhook handler as fallback for order creation
4. **Monitor** logs for any issues

---

**Last Updated**: December 16, 2024  
**Status**: ✅ Request format now matches Postman exactly (except files)  
**Version**: 2.0
