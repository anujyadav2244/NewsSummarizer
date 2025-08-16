# AI Content Summarizer – Backend API Documentation

The backend service for **AI Content Summarizer**, built using **Spring Boot**. It allows users to submit URLs or text content and receive summarized articles using **RapidAPI AI Article Extractor and Summarizer**.

---

### Authentication API (`/api/auth`)

#### 1. `POST /api/auth/register`

Registers a new user and sends an OTP to their email for verification.

**Request Body** (JSON):

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Responses**:

* `200 OK`: OTP sent to email.
* `400 Bad Request`: Email already registered or invalid input.
* `500 Internal Server Error`: Unexpected error.

---

#### 2. `POST /api/auth/verify-otp`

Verifies the OTP sent to the user's email.

**Request Body** (JSON):

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Responses**:

* `200 OK`: Email verified successfully.
* `400 Bad Request`: Invalid or expired OTP.
* `404 Not Found`: User not found.
* `500 Internal Server Error`: Unexpected error.

---

#### 3. `POST /api/auth/login`

Authenticates a verified user and returns a JWT token.

**Request Body** (JSON):

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Responses**:

* `200 OK`: Returns JWT token and user ID.
* `401 Unauthorized`: Invalid credentials or email not verified.
* `500 Internal Server Error`: Login failed.

---

#### 4. `GET /api/auth/me`

Fetches the currently authenticated user using JWT in the `Authorization` header.

**Response**:

* `200 OK`: User object.
* `404 Not Found`: User not found.

---

#### 5. `DELETE /api/auth`

Deletes the authenticated user account.

**Response**:

* `200 OK`: Account deleted.
* `404 Not Found`: User not found.

---

### Summarization API (`/api/summarize`)

#### 1. `POST /api/summarize/url`

Submits a URL and returns a summarized article. **No history is saved**.

**Request Body** (JSON):

```json
{
  "url": "https://example.com/article"
}
```

**Responses**:

* `200 OK`: Returns summarized text.
* `400 Bad Request`: Missing URL or invalid input.
* `500 Internal Server Error`: Error during summarization.

---

#### 2. `POST /api/summarize/text`

Submits raw text and returns a summarized version. **No history is saved**.

**Request Body** (JSON):

```json
{
  "text": "Long article or content goes here..."
}
```

**Responses**:

* `200 OK`: Returns summarized text.
* `400 Bad Request`: Missing text or invalid input.
* `500 Internal Server Error`: Error during summarization.

---

## Security

* JWT-based stateless authentication.
* Passwords are securely hashed using `PasswordEncoder`.
* Email verification is enforced before login.

---

## AI Summarization

The summarization logic is powered by the **RapidAPI AI Article Extractor and Summarizer**, which extracts content from URLs or raw text and generates concise summaries. No records are saved in the database.

---

## Tech Stack

* Backend: Java, Spring Boot
* Security: Spring Security, JWT
* AI Engine: RapidAPI AI Article Extractor and Summarizer
* Mail: SMTP-based OTP email via `EmailService`

---

## Setup & Run Locally

```bash
# Clone repository
git clone https://github.com/your-username/AI-Content-Summarizer.git
cd server

# 1. Configure environment variables in application.properties
#    - Mail SMTP config
#    - RapidAPI API Key
#    - JWT Secret
# Use `application-sample.properties` as a template to create your own `application.properties`.

# 2. Run the app
./mvnw spring-boot:run
```

---

## Prerequisites

* Java 17 or higher
* Maven 3+

---

## Folder Structure

```
root/
└── server/                  # Spring Boot backend
    ├── src/
    │   └── main/
    │       ├── java/com/news/summarizer/
    │       │   ├── config/       # Spring Security config
    │       │   ├── controller/   # REST controllers
    │       │   ├── model/        # Entity models (optional)
    │       │   ├── security/     # JWT token utils and filters
    │       │   └── service/      # Business logic and RapidAPI integration
    │       └── resources/
    │           ├── static/
    │           ├── templates/
    │           ├── application.properties
    │           └── application-sample.properties
    └── pom.xml

