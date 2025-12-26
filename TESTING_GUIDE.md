# Testing Guide: Backend Registration Integration

## 🧪 Pre-Testing Checklist

Before you start testing, ensure:
- [ ] Backend API is running at `http://193.203.161.174:3007`
- [ ] Backend endpoint `/api/web/auth/register` is accessible
- [ ] AWS Cognito is properly configured
- [ ] Frontend app is running (`npm run dev`)
- [ ] Browser console is open (F12)

## 📝 Test Scenarios

### Test 1: Email/Password Registration (New User)

**Objective**: Verify that a new user registering with email/password is added to both Cognito and your database.

**Steps**:
1. Open your app in browser
2. Navigate to registration/signup page
3. Open browser console (F12)
4. Fill in the registration form:
   ```
   Full Name: Test User One
   Email: testuser1@example.com
   Password: TestPass123!
   ```
5. Click "Register" or "Sign Up"

**Expected Results**:
- ✅ User is successfully registered in Cognito
- ✅ Console shows: `"User successfully registered in database"`
- ✅ User is automatically logged in (if email verification is disabled)
- ✅ Check your backend database for:
  - Email: `testuser1@example.com`
  - Full Name: `Test User One`
  - User ID: `cognito_[some-id]` (starts with "cognito_")

**Console Logs to Look For**:
```
Raw user from AWS: { userId: "...", ... }
User successfully registered in database: { success: true, ... }
```

---

### Test 2: Google Sign-In (First Time)

**Objective**: Verify that a user signing in with Google for the first time is added to your database.

**Steps**:
1. Open your app in browser (use incognito/private mode)
2. Open browser console (F12)
3. Click "Sign in with Google"
4. Complete Google authentication
5. Allow permissions if prompted

**Expected Results**:
- ✅ User is authenticated via Google
- ✅ Console shows: `"Provider from token: google"`
- ✅ Console shows: `"User successfully registered in database"`
- ✅ User is logged into the app
- ✅ Check your backend database for:
  - Email: Your Google email
  - Full Name: Your Google account name
  - User ID: `google_[google-user-id]` (starts with "google_")

**Console Logs to Look For**:
```
JWT payload: { email: "...", name: "...", identities: [...], ... }
Provider from token: google
User successfully registered/updated in database: { success: true, ... }
```

---

### Test 3: Google Sign-In (Returning User)

**Objective**: Verify that a returning Google user doesn't create duplicates.

**Steps**:
1. Sign out from the app
2. Click "Sign in with Google" again
3. Use the same Google account as Test 2

**Expected Results**:
- ✅ User is authenticated
- ✅ Console shows: `"User successfully registered/updated in database"`
- ✅ Check your backend database:
  - Only ONE record for this Google email
  - User data is updated (if backend implements upsert)

---

### Test 4: Apple Sign-In (First Time)

**Objective**: Verify that a user signing in with Apple for the first time is added to your database.

**Steps**:
1. Open your app in browser (use incognito/private mode)
2. Open browser console (F12)
3. Click "Sign in with Apple"
4. Complete Apple authentication
5. Allow permissions if prompted

**Expected Results**:
- ✅ User is authenticated via Apple
- ✅ Console shows: `"Provider from token: apple"`
- ✅ Console shows: `"User successfully registered in database"`
- ✅ User is logged into the app
- ✅ Check your backend database for:
  - Email: Your Apple email (may be private relay)
  - Full Name: Your Apple account name
  - User ID: `apple_[apple-user-id]` (starts with "apple_")

**Console Logs to Look For**:
```
JWT payload: { email: "...", name: "...", identities: [...], ... }
Provider from token: apple
User successfully registered/updated in database: { success: true, ... }
```

---

### Test 5: Backend API Failure (Resilience Test)

**Objective**: Verify that authentication still works even if the backend is down.

**Steps**:
1. **Stop your backend API** (or temporarily change the API URL to an invalid one)
2. Try to register a new user with email/password
   ```
   Full Name: Test User Two
   Email: testuser2@example.com
   Password: TestPass123!
   ```

**Expected Results**:
- ✅ User is still registered in Cognito
- ✅ Console shows: `"Failed to register user in database"` (error logged)
- ✅ User is still logged in successfully
- ✅ App continues to work normally
- ⚠️ User is NOT in your backend database (expected)

**Console Logs to Look For**:
```
Failed to register user in database: [error message]
```

**After Test**:
- Restart your backend API
- Have the user log in again
- The backend registration should succeed on the next login

---

### Test 6: Multiple Authentication Methods (Same Email)

**Objective**: Verify behavior when a user uses different authentication methods with the same email.

**Steps**:
1. Register with email/password: `test@example.com`
2. Sign out
3. Try to sign in with Google using the same email: `test@example.com`

**Expected Results**:
- ⚠️ This depends on your Cognito configuration
- Cognito may link accounts or treat them as separate
- Check your backend database for:
  - Two separate records (if Cognito treats them separately):
    - `cognito_[id]` for email/password
    - `google_[id]` for Google sign-in
  - OR one record (if Cognito links accounts)

---

## 🔍 Debugging Tips

### Issue: "Failed to register user in database"

**Possible Causes**:
1. Backend API is not running
2. API endpoint URL is incorrect
3. Backend is rejecting the request (CORS, validation, etc.)
4. Network connectivity issues

**How to Debug**:
1. Check browser Network tab (F12 → Network)
2. Look for the POST request to `/api/web/auth/register`
3. Check the request payload and response
4. Verify backend logs for errors

### Issue: "User successfully registered" but not in database

**Possible Causes**:
1. Backend returned success but didn't actually save
2. Database connection issues on backend
3. Backend validation silently failing

**How to Debug**:
1. Check backend logs
2. Add logging in your backend API
3. Verify database connection
4. Test the API endpoint directly with Postman

### Issue: Duplicate users created

**Possible Causes**:
1. Backend doesn't implement upsert logic
2. User ID format is inconsistent

**How to Debug**:
1. Check user_id values in database
2. Verify backend uses user_id as unique identifier
3. Implement upsert logic in backend (see documentation)

### Issue: Wrong provider prefix

**Possible Causes**:
1. JWT token doesn't contain expected fields
2. Provider detection logic needs adjustment

**How to Debug**:
1. Check console log for "JWT payload"
2. Verify the structure of the token
3. Adjust provider detection in `updateUserFromAmplify()`

---

## 📊 Test Results Template

Use this template to track your test results:

```
Date: ___________
Tester: ___________

Test 1: Email/Password Registration
[ ] PASS  [ ] FAIL
Notes: _________________________________

Test 2: Google Sign-In (First Time)
[ ] PASS  [ ] FAIL
Notes: _________________________________

Test 3: Google Sign-In (Returning User)
[ ] PASS  [ ] FAIL
Notes: _________________________________

Test 4: Apple Sign-In (First Time)
[ ] PASS  [ ] FAIL
Notes: _________________________________

Test 5: Backend API Failure
[ ] PASS  [ ] FAIL
Notes: _________________________________

Test 6: Multiple Authentication Methods
[ ] PASS  [ ] FAIL
Notes: _________________________________

Overall Status: [ ] ALL PASS  [ ] SOME FAILURES

Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________
```

---

## 🎯 Success Criteria

All tests pass when:
- ✅ Users can register with email/password
- ✅ Users can sign in with Google
- ✅ Users can sign in with Apple
- ✅ All users appear in backend database
- ✅ User IDs have correct provider prefixes
- ✅ No duplicate users are created
- ✅ Authentication works even if backend is down
- ✅ Console logs show expected messages

---

## 📞 Need Help?

If tests are failing:
1. Check the console logs carefully
2. Review `BACKEND_REGISTRATION_INTEGRATION.md` for detailed documentation
3. Verify backend API is running and accessible
4. Test backend API directly with Postman
5. Check Cognito configuration in AWS Console

---

## 🚀 Next Steps After Testing

Once all tests pass:
1. Remove test users from database
2. Deploy to production
3. Monitor production logs
4. Set up error tracking (e.g., Sentry)
5. Add analytics for registration sources
