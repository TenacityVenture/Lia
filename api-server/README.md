# API Server Documentation

## 📡 Core API Endpoints for LIA

The following table outlines the core API endpoints available in the LIA API server. These endpoints are designed to handle user authentication, content generation, usage tracking, and billing.

| **Method** | **URL**                     | **Purpose**                     | **Auth Needed?** | **Notes**                                                                 |
|------------|-----------------------------|---------------------------------|------------------|---------------------------------------------------------------------------|
| POST       | `/api/auth/register`        | Create new user                 | No (first time)  | For email/password signup (optional if using Supabase auth)              |
| POST       | `/api/auth/login`           | Login user, issue JWT           | No               | Extension or website stores JWT                                                     |
| GET       | `/api/auth/oauth/linkedIn-sync`           | Sync linkedin oauth user with our users table, issue JWT           | Yes               | Extension or website gets notified that the user has been synced                                                    |
| POST       | `/api/auth/refresh-token`   | Refresh user session, issue JWT | ✅ Yes - Refresh token needed also | Extension or website stores JWT                                                     |
| POST       | `/api/auth/logout`          | logout user and clear refresh token | ✅ Yes Refresh token needed also | Extension or website needs to login again and gets a new access_token and refresh token                                                     |
| GET        | `/api/user/me`              | Get my user profile             | ✅ Yes           | Useful for extension                                                     |
| POST       | `/api/prompt/rewrite`       | Rewrite LinkedIn post           | ✅ Yes           | Send text, tone, length                                                  |
| POST       | `/api/prompt/suggest-reply` | Suggest a reply to a comment    | ✅ Yes           | Send comment text                                                        |
| GET        | `/api/usage/stats`          | Get user's usage stats          | ✅ Yes           | For showing dashboard in extension (e.g., “You saved 10 hours!”)         |
| POST       | `/api/billing/subscribe`    | Subscribe to Pro Plan (Stripe)  | ✅ Yes           | Initiates checkout session (future)                                      |
| GET        | `/api/billing/status`       | Check billing status            | ✅ Yes           | Free vs Pro                                                              |

### Notes:
- **Authentication**: Endpoints marked with "✅ Yes" under "Auth Needed?" require a valid JWT token for access.
- **Billing**: Billing-related endpoints integrate with Stripe for subscription management.
- **Usage Tracking**: The `/api/usage/stats` endpoint provides insights into user activity and time saved.

For more details on how to use these endpoints, refer to the API documentation or contact the development team.


# 🧠 How Each Endpoint Works


## 🚀 /api/auth/register
**Fields:** `{ name, email, password }`

- Creates a user record.
- Returns a JWT if successful.

## 🚀 /api/auth/login
**Fields:** `{ email, password }`

- Verifies credentials.
- Returns a JWT.

✅ Supabase handles most of this which is what we will be using - Supabase Auth (But we can still customize the flow).

## 🚀 /api/user/me
**Header:** `Authorization: Bearer <JWT>`

**Returns:** `{ id, name, username, linkedin_handle, profile_picture_url }`

- For personalized extension view.

## 🚀 /api/prompt/rewrite
**Header:** `Authorization: Bearer <JWT>`

**Body:**  
```json
{ "original_text": "Feeling happy to work here", "tone": "professional", "length": "short" }
```

**Server:**
- Builds smart prompt.
- Sends it to OpenAI.
- Returns improved text.

## 🚀 /api/prompt/suggest-reply
**Header:** `Authorization: Bearer <JWT>`

**Body:**  
```json
{ "comment_text": "Congratulations on your promotion!" }
```

**Server:**
- Builds smart prompt.
- Sends to OpenAI.
- Returns reply suggestion.

## 🚀 /api/usage/stats
**Header:** `Authorization: Bearer <JWT>`

**Returns:**  
```json
{
  "posts_rewritten": 34,
  "comments_suggested": 120,
  "tokens_used": 50000
}
```

✅ Extension can show "Look how much LIA helped you!" 🎉

## 🚀 /api/billing/subscribe
- Redirects to Stripe Checkout page (Pro Plan purchase).
- Optional now, needed when you monetize.

## 🚀 /api/billing/status
**Header:** `Authorization: Bearer <JWT>`

**Returns:**  
```json
{
  "plan_type": "pro",
  "subscription_end": "2024-09-01"
}
```

✅ Needed to limit features for free users later.

---

## 📋 API Folder Structure (inside our Express server)

```
api-server/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── promptController.js
│   │   ├── usageController.js
│   │   └── billingController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── promptRoutes.js
│   │   ├── usageRoutes.js
│   │   └── billingRoutes.js
│   └── server.js
```

- Each controller focuses only on its job (clean separation).
- Each route just maps HTTP methods to controller functions.

---


