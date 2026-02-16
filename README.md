# mini_task_tracker
This is a full-stack web application created using React.js, Java(SpringBoot), MySQL

## how to run backend
### 01.
Open the server folder from an IDE like intellij which allows running springboot applcations. (Once opened, it will automatically resolve some dependencies needed)

### 02.
From intellij on topbar at right side goto "Edit Configurations...". This will open a dialog box ---> Click "Add New" ---> Select "Application" ---> Here Relevant java SDK(ex: Java 17) and the working directory will automatically be selected. Click the browse button at Main class input field and choose the main class. ---> Click "Apply" and "OK"

Note: Here no need to set any Envirnment variables since all the configurations are hardcoded at server/src/main/resources/application.properties file for easier setup

### 03.
Open the application.properties file at server/src/main/resources/application.properties. Replace following with correct values, 
1) DB_URL      - jdbc:mysql://localhost:<mysql_local_server_port>/<database_name>
   Here default value for "mysql_local_server_port" is 3306. If you wish to create the database and tables automatically when backend runs, you need to create a database(schema) in mysql with the name you given in above url
2) DB_USERNAME - default value is root
3) DB_PASSWORD - Your MySQL server password

Server port(port, the backend runs) is already configured as 8080.
Allowed front end origin is already configured as `http://localhost:5173` which has the default port(5173) of React apps

### 04.
Run the server(backend) by clicking the run button at topbar


## how to run frontend
### 01.
Open the client folder from an IDE like VS Code which allows running React applications.

### 02.
Open the terminal in VS code and make sure you are in root(client/) directory. Install required dependennies.
    ```bash
    npm install
    ```
### 03.
Create a file named ".env" at the root directory of client (client/.env). 
    ```bash
    touch .env
    ```
Copy paste the following configurations on .env file,
1. VITE_API_BASE_URL=http://localhost:8080/api
2. VITE_WS_URL=ws://localhost:8080/ws
3. VITE_API_TARGET=http://localhost:8080

### 04. 
Run the React app
    ```bash
    npm run dev
    ```
Open the link in Browser(Chrome)

## how to set up the database using dbscript
Please see the instrcutions given at dbscript/README.md

# Note: After setting up all, re-run both Front-end and Back-end and try to login. You can register a new user and login OR use the default credentails if you created an user when setting up the database as in the instructions

