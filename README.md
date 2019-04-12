# Coolinar Server

Coolinar Server is the API for the Coolinar recipes website.

## Description

Coolinar is a simple recipes website where users can explore, create recipes and post reviews.

## Getting Started

### Main Dependencies

* Nest JS
  - [NestJS Website](https://nestjs.com) 
* TypeORM
  - [TypeORM Website](https://typeorm.io/) 
  - [TypeORM npm package](https://www.npmjs.com/package/typeorm)
* MongoDB
  - [MongoDB Website](https://www.mongodb.com/)
  - [MongoDB npm package](https://www.npmjs.com/package/mongodb)

### Installing

This project requires having [Node.js with NPM](https://nodejs.org/en/) and 
[MongoDB](https://www.mongodb.com/download-center) installed on your computer.

1. Download the project using the **Download ZIP** button on the GitHub page.
2. Clone the git project as follows
    1. Download and install Git from https://git-scm.com
    2. Clone the project in the desired directory on your computer using:
    ```bash
    git clone https://github.com/Vixan/coolinar-server
    ```
3. Import the initial data. 
   1. Import users.
   ```bash
   mongoimport -d "coolinar" -c "user" --jsonArray --file "./database/users.json"
   ```
   2. Import recipes.
   ```bash
   mongoimport -d "coolinar" -c "recipe" --jsonArray --file "./database/recipes.json"
   ```
4. Enter the directory and install the npm dependencies.
  ```bash
  cd coolinar-server
  npm install
  ```
5. Start mongo server.
  ```bash
  mongod
  ```
6. Start the server.
  ```bash
  npm run start
  ```

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [Medium](https://medium.com)
* [StackOverflow](https://stackoverflow.com)
* [Dev](https://dev.to/)
* [Kelvin Mai - NestJS Ideas App](https://www.youtube.com/watch?v=NF9Xn4g5MJY&list=PLBeQxJQNprbiJm55q7nTAfhMmzIC8MWxc)
