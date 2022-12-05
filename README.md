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


# Build and Run
## Option 1: Build jar
#### Configuration
Set the url to the MySQL database in environment variable `MYSQLDBURL2`. For example, `MYSQLDBURL2=mysql://root:123456@localhost:3306/restaurant_supply_express`
#### Build jar and Run
Navigate to the project root directory and execute
```
./gradlew build
java -Dserver.port=<PORT> -jar ./rse-api/build/libs/rse-api-1.0-SNAPSHOT.jar --spring.profiles.active=prod
```
Fill `<PORT>` with desired listening port. 

## Option 2: Build Docker Image
Navigate to the project root directory and execute
```
docker build . -t 'rse'
docker run -d -p <PORT>:8080 -e MYSQLDBURL2=<url_to_database> rse
```
Fill `<PORT>` with desired listening port and `<url_to_database>` with the url to the MySQL database. 

# Run Locally
### Configuration
Set the url to the MySQL database in environment variable `MYSQLDBURL2`. For example, `MYSQLDBURL2=mysql://root:123456@localhost:3306/restaurant_supply_express`

### Backend - Spring Boot
Navigate to the project root directory and execute
```
./gradlew bootRun
```

### Frontend - React
Navigate to `./rse-react` directory and execute
```
npm i
npm run start
```
Then the frontend page should be available on [http://localhost:3000](http://localhost:3000)
