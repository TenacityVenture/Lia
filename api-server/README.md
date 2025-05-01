# API Server Documentation

## 📡 Core API Endpoints for LIA

The following table outlines the core API endpoints available in the LIA API server. These endpoints are designed to handle user authentication, content generation, usage tracking, and billing.

| **Method** | **URL**                     | **Purpose**                     | **Auth Needed?** | **Notes**                                                                 |
|------------|-----------------------------|---------------------------------|------------------|---------------------------------------------------------------------------|
| POST       | `/api/auth/register`        | Create new user                 | No (first time)  | For email/password signup (optional if using Supabase auth)              |
| POST       | `/api/auth/login`           | Login user, issue JWT           | No               | Extension stores JWT                                                     |
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
