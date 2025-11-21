# Backend Development Plan: MealPlanr

### 1️⃣ Executive Summary
- This document outlines the backend development plan for MealPlanr, an AI-driven meal planning application.
- The backend will be built using FastAPI (Python 3.13, async) and will connect to a MongoDB Atlas database using Motor and Pydantic v2 models.
- Development will follow a single-branch (`main`) Git workflow. No Docker will be used.
- The plan consists of dynamic sprints (S0...Sn) covering all frontend-visible features, with manual testing required after every task.

### 2️⃣ In-Scope & Success Criteria
- **In-Scope Features:**
  - User authentication (signup, login, logout).
  - User profile setup and management (family size, dietary restrictions, budget).
  - AI-driven meal plan generation (mocked initially).
  - Weekly meal plan view with recipe details.
  - Optimized shopping list generation.
  - Basic leftover suggestions.
  - Community recipes view (static).
- **Success Criteria:**
  - All frontend features are fully functional end-to-end with the backend.
  - All task-level manual tests pass via the UI.
  - Each sprint's code is pushed to the `main` branch after successful verification.

### 3️⃣ API Design
- **Base Path:** `/api/v1`
- **Error Envelope:** `{ "error": "message" }`

---

#### Authentication
- **`POST /api/v1/auth/signup`**
  - **Purpose:** Register a new user.
  - **Request:** `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`
  - **Response:** `{ "token": "jwt_token", "user": { ... } }`
  - **Validation:** Email must be valid and unique. Password must be strong.

- **`POST /api/v1/auth/login`**
  - **Purpose:** Log in an existing user.
  - **Request:** `{ "email": "user@example.com", "password": "password123" }`
  - **Response:** `{ "token": "jwt_token", "user": { ... } }`
  - **Validation:** Credentials must match a user in the database.

- **`POST /api/v1/auth/logout`**
  - **Purpose:** Log out a user (currently, this will be a client-side token clearing).
  - **Request:** (None)
  - **Response:** `{ "message": "Logged out successfully" }`

- **`GET /api/v1/auth/me`**
  - **Purpose:** Get the current authenticated user's profile.
  - **Request:** (Requires JWT in header)
  - **Response:** `{ "id": "...", "email": "...", ... }`

---

#### User Profile
- **`GET /api/v1/user/profile`**
  - **Purpose:** Retrieve the current user's profile.
  - **Request:** (Requires JWT)
  - **Response:** `UserProfile` object.

- **`POST /api/v1/user/profile`**
  - **Purpose:** Create or update the user's profile.
  - **Request:** `UserProfile` object (without `id`, `created_date`, `last_modified_date`).
  - **Response:** Updated `UserProfile` object.
  - **Validation:** `family_size` and `weekly_budget` must be positive numbers.

---

#### Meal Plan
- **`POST /api/v1/generate-meal-plan`**
  - **Purpose:** Generate a new weekly meal plan for the user.
  - **Request:** `UserProfile` object.
  - **Response:** `MealPlan` object.

- **`GET /api/v1/meal-plan/current`**
  - **Purpose:** Get the user's most recently generated meal plan.
  - **Request:** (Requires JWT)
  - **Response:** `MealPlan` object or `null`.

---

#### Recipes & Shopping List
- **`GET /api/v1/recipes/{recipeId}`**
  - **Purpose:** Get details for a specific recipe.
  - **Request:** (Requires JWT)
  - **Response:** `Recipe` object.

- **`POST /api/v1/shopping-list`**
  - **Purpose:** Generate a shopping list for a given meal plan.
  - **Request:** `MealPlan` object.
  - **Response:** Array of `ShoppingListItem` objects.

---

#### Static Content
- **`GET /api/v1/leftover-suggestions`**
  - **Purpose:** Get a list of mock leftover suggestions.
  - **Request:** (Requires JWT)
  - **Response:** Array of `LeftoverSuggestion` objects.

- **`GET /api/v1/community-recipes`**
  - **Purpose:** Get a list of mock community recipes.
  - **Request:** (Requires JWT)
  - **Response:** Array of `CommunityRecipe` objects.

### 4️⃣ Data Model (MongoDB Atlas)

- **`users` collection**
  - `_id`: ObjectId (PK)
  - `email`: String (required, unique)
  - `password`: String (required, hashed)
  - `name`: String
  - `family_size`: Integer (default: 1)
  - `dietary_restrictions`: Array of Strings
  - `weekly_budget`: Float
  - `created_date`: DateTime
  - `last_modified_date`: DateTime
  - **Example:**
    ```json
    {
      "_id": "ObjectId('...')",
      "email": "sarah@example.com",
      "password": "hashed_password",
      "name": "Sarah",
      "family_size": 4,
      "dietary_restrictions": ["vegetarian"],
      "weekly_budget": 150.0,
      "created_date": "2025-11-20T14:00:00Z",
      "last_modified_date": "2025-11-20T14:00:00Z"
    }
    ```

- **`meal_plans` collection**
  - `_id`: ObjectId (PK)
  - `user_id`: ObjectId (ref: `users`)
  - `start_date`: String
  - `end_date`: String
  - `days`: Array of embedded `DayPlan` documents
  - `estimated_spend`: Float
  - `estimated_savings_percentage`: Float
  - `created_date`: DateTime
  - **Example:**
    ```json
    {
      "_id": "ObjectId('...')",
      "user_id": "ObjectId('...')",
      "start_date": "2025-11-20",
      "end_date": "2025-11-26",
      "days": [ { "day_of_week": "Monday", "meals": [...] } ],
      "estimated_spend": 125.50,
      "estimated_savings_percentage": 22,
      "created_date": "2025-11-20T14:05:00Z"
    }
    ```

- **`recipes` collection**
  - `_id`: ObjectId (PK)
  - `name`: String
  - `description`: String
  - `ingredients`: Array of embedded `IngredientItem` documents
  - `instructions`: Array of Strings
  - `estimated_cost`: Float
  - `tags`: Array of Strings
  - `source`: String ("AI Generated" or "Community")
  - **Example:**
    ```json
    {
      "_id": "ObjectId('...')",
      "name": "Lentil Soup",
      "description": "A comforting and budget-friendly lentil soup.",
      "ingredients": [ { "item_name": "Brown Lentils", "quantity": 1, "unit": "cup" } ],
      "instructions": [ "Rinse lentils...", "Sauté vegetables..." ],
      "estimated_cost": 3.20,
      "tags": ["vegetarian", "budget-friendly"],
      "source": "AI Generated"
    }
    ```

### 5️⃣ Frontend Audit & Feature Map

- **OnboardingPage (`/onboarding`)**
  - **Purpose:** Collects user preferences.
  - **Data Needed:** `UserProfile` fields.
  - **Endpoint:** `POST /api/v1/user/profile`
  - **Models:** `UserProfile`

- **DashboardPage (`/dashboard`)**
  - **Purpose:** Shows budget summary and CTA to generate a plan.
  - **Data Needed:** `UserProfile`, `MealPlan` (if exists).
  - **Endpoints:** `GET /api/v1/user/profile`, `GET /api/v1/meal-plan/current`, `POST /api/v1/generate-meal-plan`
  - **Models:** `UserProfile`, `MealPlan`

- **MealPlanPage (`/meal-plan`)**
  - **Purpose:** Displays the 7-day meal plan.
  - **Data Needed:** `MealPlan`, `Recipe` details for each meal.
  - **Endpoints:** `GET /api/v1/meal-plan/current`, `GET /api/v1/recipes/{recipeId}`
  - **Models:** `MealPlan`, `Recipe`

- **ShoppingListPage (`/shopping-list`)**
  - **Purpose:** Displays the consolidated shopping list.
  - **Data Needed:** `MealPlan` to generate the list.
  - **Endpoint:** `POST /api/v1/shopping-list`
  - **Models:** `ShoppingListItem`, `MealPlan`

- **LeftoversPage (`/leftovers`)**
  - **Purpose:** Shows leftover suggestions.
  - **Data Needed:** Static list of suggestions.
  - **Endpoint:** `GET /api/v1/leftover-suggestions`
  - **Models:** `LeftoverSuggestion`

- **CommunityPage (`/community`)**
  - **Purpose:** Shows community recipes.
  - **Data Needed:** Static list of recipes.
  - **Endpoint:** `GET /api/v1/community-recipes`
  - **Models:** `CommunityRecipe`

### 6️⃣ Configuration & ENV Vars
- `APP_ENV`: `development` or `production`
- `PORT`: `8000`
- `MONGODB_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: Secret key for signing JWTs.
- `JWT_EXPIRES_IN`: `86400` (24 hours in seconds)
- `CORS_ORIGINS`: Frontend URL (e.g., `http://localhost:5173`)

### 7️⃣ Testing Strategy (Manual via Frontend)
- Validation will be performed exclusively through the frontend UI.
- Every task includes a **Manual Test Step** and a **User Test Prompt**.
- After all tasks in a sprint pass their tests, the code will be committed and pushed to `main`.
- If any test fails, the issue must be fixed and re-tested before pushing.

### 8️⃣ Dynamic Sprint Plan & Backlog

---

### S0 – Environment Setup & Frontend Connection

**Objectives:**
- Create a FastAPI skeleton with `/api/v1` base path and a `/healthz` endpoint.
- Connect to MongoDB Atlas using the `MONGODB_URI` env var.
- Implement the `/healthz` endpoint to perform a DB ping and return a JSON status.
- Enable CORS to allow requests from the frontend.
- Replace dummy API URLs in the frontend with the real backend URLs.
- Initialize a single Git repository at the project root, set the default branch to `main`, and push to GitHub.
- Create a single `.gitignore` file at the root to ignore `__pycache__`, `.env`, `*.pyc`, etc.

**Definition of Done:**
- The backend runs locally and successfully connects to MongoDB Atlas.
- The `/healthz` endpoint returns a success status including DB connectivity.
- The frontend can make requests to the backend and receive responses.
- The repository is live on GitHub with the initial commit on the `main` branch.

**Manual Test Step:**
- Run the backend server. Open the frontend application in the browser. Check the browser's developer tools (Network tab) to confirm a successful `GET` request to `/healthz` returns a 200 OK status with a JSON body indicating a successful DB connection.

**User Test Prompt:**
> "Start the backend and refresh the app. Confirm that the status shows a successful DB connection."

---

### S1 – Basic Auth (Signup / Login / Logout)

**Objectives:**
- Implement JWT-based user signup, login, and logout functionality.
- Protect at least one backend route and one corresponding frontend page to require authentication.

**User Stories:**
- As a new user, I want to sign up for an account so I can save my meal plans.
- As an existing user, I want to log in to access my profile and meal plans.
- As a logged-in user, I want to log out to secure my account.

**Tasks:**
- **Task 1.1: User Model & Signup**
  - Create the `User` Pydantic model and MongoDB collection.
  - Implement the `POST /api/v1/auth/signup` endpoint.
  - Store the user in MongoDB with a hashed password (use Argon2 or Bcrypt).
  - **Manual Test Step:** Use the signup form in the UI to create a new account. Verify that a success message is shown and the user is logged in.
  - **User Test Prompt:** "Create a new account using the signup form and verify you are logged in and redirected to the dashboard."

- **Task 1.2: Login Endpoint**
  - Implement the `POST /api/v1/auth/login` endpoint.
  - On successful login, issue a JWT containing the user ID.
  - **Manual Test Step:** Log out, then use the login form in the UI with the credentials created in the previous step. Verify the user is redirected to the dashboard and a token is saved in the browser's local storage.
  - **User Test Prompt:** "Log in with your new account and confirm you are taken to the dashboard."

- **Task 1.3: Protect Routes**
  - Create a dependency to verify the JWT on protected routes.
  - Protect the `/api/v1/user/profile` endpoint.
  - Ensure the frontend's `AuthWrapper` correctly redirects unauthenticated users from protected pages (like `/dashboard`).
  - **Manual Test Step:** Log out. Attempt to navigate directly to the `/dashboard` URL. Verify you are redirected to the login page.
  - **User Test Prompt:** "After logging out, try to access the dashboard directly. You should be redirected to the login page."

**Definition of Done:**
- The complete authentication flow (signup, login, logout, route protection) works end-to-end in the frontend.

**Post-sprint:**
- Commit and push all changes to the `main` branch.

---

### S2 – User Profile & Meal Plan Generation

**Objectives:**
- Allow users to create and update their profile.
- Implement the core meal plan generation logic (using mock data).
- Connect the frontend dashboard to the real profile and meal plan endpoints.

**User Stories:**
- As a user, I want to set my family size, dietary needs, and budget to get a personalized plan.
- As a user, I want to generate a new meal plan from my dashboard.

**Tasks:**
- **Task 2.1: Profile Management API**
  - Implement `GET` and `POST` endpoints for `/api/v1/user/profile`.
  - The `POST` endpoint should handle both creation (during onboarding) and updates.
  - **Manual Test Step:** Complete the onboarding form in the UI. Verify the data is saved. Go to a (future) settings page or re-trigger onboarding to update the profile and verify changes are saved.
  - **User Test Prompt:** "Complete the onboarding process. Then, try to change your weekly budget and verify the new value is saved and displayed correctly on the dashboard."

- **Task 2.2: Meal Plan Generation API**
  - Implement `POST /api/v1/generate-meal-plan` and `GET /api/v1/meal-plan/current`.
  - For now, the generation logic can be a port of the `apiMock.ts` logic, returning a static or semi-random plan based on user preferences.
  - Save the generated plan to the `meal_plans` collection.
  - **Manual Test Step:** From the dashboard, click the "Generate Weekly Meal Plan" button. Verify that you are redirected to the `/meal-plan` page and a valid plan is displayed.
  - **User Test Prompt:** "Click the 'Generate Weekly Meal Plan' button on the dashboard and confirm that a new meal plan is displayed."

- **Task 2.3: Recipe & Static Content API**
  - Implement `GET /api/v1/recipes/{recipeId}`, `GET /api/v1/leftover-suggestions`, and `GET /api/v1/community-recipes`.
  - These endpoints will serve static, mocked data from the database. Create a small script to pre-populate the `recipes` collection with the mock data.
  - **Manual Test Step:** On the meal plan page, click "View Recipe" on a meal card. Verify the recipe details drawer opens with the correct information. Navigate to the Leftovers and Community pages and verify the content loads.
  - **User Test Prompt:** "Check that you can view recipe details from the meal plan page, and that the Leftovers and Community pages load their respective content."

**Definition of Done:**
- Users can complete onboarding, manage their profile, and generate a meal plan that is displayed correctly.

**Post-sprint:**
- Commit and push all changes to the `main` branch.

---

### S3 – Shopping List & Final Connections

**Objectives:**
- Implement the shopping list generation.
- Ensure all frontend components are fetching data from the live backend.

**User Stories:**
- As a user, I want to see a consolidated shopping list for my meal plan to make grocery shopping easier.

**Tasks:**
- **Task 3.1: Shopping List API**
  - Implement the `POST /api/v1/shopping-list` endpoint.
  - The logic will take a `MealPlan` object, aggregate all ingredients from its recipes, and return a categorized list of `ShoppingListItem`.
  - **Manual Test Step:** After generating a meal plan, click the "View Shopping List" button. Verify that the shopping list page loads with a correctly categorized and priced list of ingredients.
  - **User Test Prompt:** "Generate a meal plan, then view the shopping list. Confirm that all necessary ingredients are listed and grouped by category."

- **Task 3.2: Full Frontend Integration Review**
  - Go through every page and component in the frontend.
  - Remove any remaining calls to `apiMock.ts` and ensure all data is fetched from the FastAPI backend.
  - Verify that loading states and error handling are working correctly for all API calls.
  - **Manual Test Step:** Perform a full end-to-end test of the user journey: Signup -> Onboarding -> Generate Plan -> View Plan -> View Recipe -> View Shopping List -> Logout.
  - **User Test Prompt:** "Test the entire application flow from start to finish. Make sure every page loads data correctly and there are no errors."

**Definition of Done:**
- The shopping list feature is fully functional.
- The frontend is completely decoupled from the mock API service.
- The application is feature-complete for the MVP.

**Post-sprint:**
- Commit and push all changes to the `main` branch.