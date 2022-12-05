# GT-CS-4400-Project
CS 4400 (Fall 2022) Project Phase 4 - Group 19

# Current Progress:

Finished **Employee view** and **Add Employee** form. 


# Visit
Deployed on [https://cs4400rse.onrender.com](https://cs4400rse.onrender.com). Please wait for about 1.5 minutes for the server to start. 

Also deployed on [http://45.17.163.14](http://45.17.163.14). No need to wait on this one. 

# Framework and Tools Used
  
   | Components  | Technology  | 
   | :---        |    :----:   |   
   | Frontend  | React 16, Ant Design  | 
   | Backend   | Spring Boot 2.7.5, Java 17 |
   | Database | MySQL 8.0 |
   | Build| Gradle 7.4, Docker |


# Option 1: Build and Run

## Option 1.1: Build jar
### Prerequisite Installation
- Gradle 7.4
- Java 17

#### Configuration
Set the url to the MySQL database in environment variable `MYSQLDBURL2`. For example, set `MYSQLDBURL2` to `mysql://<username>:<passwd>@<mysql_server_address>:3306/restaurant_supply_express`, replacing `<username>`, `<passwd>`, and `<mysql_server_address>` with your MySQL config. 
#### Build jar and Run
Navigate to the project root directory and execute the following. Fill `<PORT>` with desired listening port, e.g. 8080. 
```
./gradlew build
java -Dserver.port=<PORT> -jar ./rse-api/build/libs/rse-api-1.0-SNAPSHOT.jar --spring.profiles.active=prod
```
Then the frontend page should be available on [http://localhost:\<PORT\>](http://localhost:<PORT>) (the PORT number you just used). 

## Option 1.2: Build Docker Image
Make sure Docker installed. 

Navigate to the project root directory and execute the following. Fill `<PORT>` with desired listening port (e.g. 8080) and `<url_to_database>` with the url to the MySQL database, e.g. `mysql://<username>:<passwd>@<mysql_server>:3306/restaurant_supply_express` (make sure `<username>`, `<passwd>`, and `<mysql_server_address>` are filled). 
```
docker build . -t 'rse'
docker run -d -p <PORT>:8080 -e MYSQLDBURL2=<url_to_database> rse
```

# Option 2: Run Locally
### Prerequisite Installation
- Gradle 7.4
- Java 17
- Node 18.12.1

### Configuration
Set the url to the MySQL database in environment variable `MYSQLDBURL2`. For example, set `MYSQLDBURL2` to `mysql://<username>:<passwd>@<mysql_server_address>:3306/restaurant_supply_express`, replacing `<username>`, `<passwd>`, and `<mysql_server_address>` with your MySQL config. 

### Backend - Spring Boot
Navigate to the project root directory and execute
```
./gradlew bootRun
```

### Frontend - React
Navigate to `./rse-react` directory and execute
```
npm install
npm run start
```
Then the frontend page should be available on [http://localhost:3000](http://localhost:3000). 
