# Meal Planner Application

This is a full-stack web application designed to simplify meal planning and grocery shopping. Users can create personalized meal plans, automatically generate shopping lists, and manage leftovers to reduce food waste.

## Table of Contents

- [About The Project](#about-the-project)
  - [Key Features](#key-features)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Frontend](#frontend)
  - [Backend](#backend)

## About The Project

This application provides a seamless experience for planning weekly meals. It features a modern, responsive frontend built with React and a robust RESTful API backend powered by FastAPI. The goal is to make meal prep organized, efficient, and less wasteful.

### Key Features:

*   **Secure User Authentication:** Users can sign up and log in to manage their personal data.
*   **Onboarding Process:** A guided setup for new users to personalize their experience.
*   **Interactive Dashboard:** A central hub to view upcoming meals and daily nutritional information.
*   **Meal Plan Management:** Easily create, view, and modify weekly meal plans.
*   **Automated Shopping List:** Automatically generates a shopping list based on the current meal plan.
*   **Leftover Tracking:** A dedicated section to manage leftovers and minimize food waste.
*   **Community Hub:** A space for users to share and discover meal plans from others.

### Built With

**Frontend:**
*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [React Router](https://reactrouter.com/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Shadcn/ui](https://ui.shadcn.com/)
*   [TanStack Query](https://tanstack.com/query/)

**Backend:**
*   [FastAPI](https://fastapi.tiangolo.com/)
*   [Python](https://www.python.org/)
*   [MongoDB](https://www.mongodb.com/) (with [Motor](https://motor.readthedocs.io/))
*   [Pydantic](https://pydantic-docs.helpmanual.io/)
*   [JWT](https://jwt.io/) for authentication

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

*   **Node.js and pnpm:** [https://pnpm.io/installation](https://pnpm.io/installation)
*   **Python 3.8+ and pip:** [https://www.python.org/downloads/](https://www.python.org/downloads/)
*   **MongoDB:** [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Set up the Backend:**
    ```sh
    cd backend
    python -m venv venv
    # Activate the virtual environment
    # On Windows:
    # venv\Scripts\activate
    # On macOS/Linux:
    # source venv/bin/activate
    pip install -r requirements.txt
    # Create a .env file from env.sample and fill in your database details
    cp env.sample .env
    cd ..
    ```

3.  **Set up the Frontend:**
    ```sh
    cd frontend
    pnpm install
    cd ..
    ```

## Running the Application

### Backend

To run the backend server, navigate to the `backend` directory and run:
```sh
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### Frontend

To run the frontend development server, navigate to the `frontend` directory and run:
```sh
pnpm run dev
```
The application will be available at `http://localhost:5173` (or another port if 5173 is busy).
