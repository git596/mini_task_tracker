This(dbscript) folder contains SQL scripts for setting up the MySQL database for the Mini Task Tracker application.

## Files

- **schema.sql** - Creates the database and its tables
- **data.sql** - Inserts sample/master data for testing

## Setup Instructions

### Option 1: Manual Execution (Open CMD/Terminal and run following commands)

1. **Connect to your MySQL database (After running this command you may need to enter password for the MySQL server):**
   ```bash
   mysql -u root -p
   ```

2. **create database and tables:**

   **Run the schema script(replace the path-to-server accordingly)**
   ```sql
   source path-to-server/dbscript/schema.sql;
   ```

   **OR**
   **copy paste the scripts at dbscript/schema.sql**

3. **Insert sample data:**

   **Run the data script(replace the path-to-server accordingly)**
   ```sql
   source path-to-server/dbscript/data.sql;
   ```

   **OR**
   **copy paste the scripts at dbscript/data.sql**

### Option 2: Automatic via Spring Boot
The application is configured with `spring.jpa.hibernate.ddl-auto=update` in `application.properties`, which means:
- Tables will be **automatically created** when you first run(successfully) the backend(server) 
- Schema changes will be **automatically applied** on subsequent runs

## Default User Credentials
After running `data.sql`, you have follwoing credentials to login to the system:
- **Username:** `demo`
- **Password:** `password123`


