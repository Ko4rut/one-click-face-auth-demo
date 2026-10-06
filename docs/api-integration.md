# Face authentication API integration skeleton

This branch prepares the web application to integrate with the separate Python AI backend without coupling UI components directly to the backend URL.

## Request flow

```text
Browser UI
  |
  | POST /api/face/enroll
  | POST /api/face/identify
  | GET  /api/face/health
  v
Next.js Route Handlers
  |
  | server-only AI_API_BASE_URL
  v
Python AI Backend
  |
  +--> EnrollmentService
  +--> IdentificationService
  +--> TemplateRepository
```

The browser only knows the internal Next.js endpoints. The Python service URL remains server-side, which avoids leaking deployment configuration and gives the web app one place to handle backend errors and later authentication/session logic.

## Provisional endpoints

The current Python repository already contains the enrollment and identification services, while its REST route/schema files are still placeholders. For that reason, the following HTTP paths and JSON fields are a provisional contract and are configurable.

### POST /api/face/enroll

Browser request:

```json
{
  "user_id": "demo-user",
  "frames": ["<base64-jpeg>", "<base64-jpeg>"]
}
```

Expected AI response shape mirrors the current EnrollmentResult service model:

```json
{
  "user_id": "demo-user",
  "is_enrolled": true,
  "accepted_samples": 5,
  "rejected_samples": 0,
  "required_samples": 5,
  "rejection_codes": []
}
```

### POST /api/face/identify

Browser request:

```json
{
  "image": "<base64-jpeg>"
}
```

Expected AI response shape mirrors the current IdentificationResult service model:

```json
{
  "is_valid_frame": true,
  "matched_id": "demo-user",
  "score": 0.92,
  "is_match": true,
  "validation_code": "VALID",
  "validation_message": "Frame hợp lệ"
}
```

### GET /api/face/health

Used later for backend status checks.

## Environment

Copy `.env.example` to `.env.local` and point `AI_API_BASE_URL` at the Python API once that service is exposed.

## Important

- Images are sent as raw Base64 strings without the `data:image/...;base64,` prefix.
- Enrollment currently uses 5 samples to match the current Python EnrollmentService default.
- The request/response contracts can be adjusted in `src/service/face-auth/types.ts` without changing page components.
- The browser-facing integration lives in `src/service/face-auth/face-auth.service.ts`.
- The server-side proxy is centralized in `src/service/ai-backend/client.ts`.
