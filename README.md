
# mini_task_tracker

This is a Mobile Responsive full-stack web application built with React.js (frontend), Java (Spring Boot, backend), and MySQL (database).

---

## Getting Started

Follow these simple steps to get your backend, frontend, and database up and running!

---

## Backend Setup

1. **Open the Backend Project**
    - Go to the `server` folder and open it in an IDE like IntelliJ IDEA (recommended for Spring Boot apps).
    - The IDE will automatically resolve dependencies for you.

2. **Configure the Run Settings**
    - In IntelliJ, go to the top right and click on **Edit Configurations...**
    - Click **Add New** → **Application**.
    - The Java SDK (e.g., Java 17) and working directory should be auto-selected.
    - Click the browse button in the **Main class** field and select the main class.
    - Click **Apply** and **OK**.

    > **Note:** No need to set environment variables! All backend configs are hardcoded in `server/src/main/resources/application.properties` for easy setup.

3. **Set Up Database Connection**
    - Open `server/src/main/resources/application.properties`.
    - Update these values:
      - `DB_URL`: `jdbc:mysql://localhost:<mysql_local_server_port>/<database_name>`
         - Default MySQL port is `3306`.
         - If you want the backend to auto-create the database and tables, create a schema in MySQL with the name you use above.
      - `DB_USERNAME`: (default is `root`)
      - `DB_PASSWORD`: (your MySQL password)
    - The backend runs on port **8080** by default.
    - Allowed frontend origin is already set to `http://localhost:5173` (the default React port).

4. **Run the Backend**
    - Click the **Run** button in your IDE's top bar.

---

## Frontend Setup

1. **Open the Frontend Project**
    - Go to the `client` folder and open it in an IDE like VS Code (recommended for React apps).

2. **Install Dependencies**
    - Open a terminal in VS Code and make sure you're in the `client/` directory.
    - Run:
      ```bash
      npm install
      ```

3. **Create the .env File**
    - In the `client/` directory, create a file named `.env`:
      ```bash
      touch .env
      ```
    - Copy and paste the following into `.env`:
      ```env
      VITE_API_BASE_URL=http://localhost:8080/api
      VITE_WS_URL=ws://localhost:8080/ws
      VITE_API_TARGET=http://localhost:8080
      ```

4. **Run the React App**
    - Start the frontend with:
      ```bash
      npm run dev
      ```
    - Open the link shown in your terminal (usually `http://localhost:5173`) in your browser (Chrome recommended).

---

## Database Setup

See the instructions in `dbscript/README.md` for setting up the database.

---

## Final Steps

After setting up everything, re-run both the frontend and backend. Try logging in! You can register a new user or use the default credentials if you created a user during the database setup (see instructions in `dbscript/README.md`).

---

