
# HeckerGround
Heckerground is an Australia online anonymous forum built using Spring Boot and React.
This site is developed with an intention to provide people in Australia a platform to ask any questions, comment on current issues or just complain on trivial matters in daily life.

Heckerground is fully anonymous, every users are equals. Fame, wealth, title does not grant anyone priviledge.
Quantity is the only thing matters in Heckerground, "*Best Restaurant in Melbourne CBD is xxx*" "*Pizza or sushi?*" "*React.js or Angular?*" Just smash that upvote/downvote button!

No reason needed, no inbetween option, just a simple yes or no, the only thing meaningful here is the number of people agreeing/disagreeing , to know the majority stands.

> Note: User can not delete, edit or undo post/comment/vote, unless the content violates the terms
> and conditions.

You can treat this as an anonymous survey site, an online forum with bare minimum moderation, just keep in mind that everything is fully anonymous and please do not dox yourself.

Heckerground is public and open source to reinforce the idea that the website is fully secured and no personal details can be leaked.

## Architecture Diagrams
[Diagrams shown here](Artifacts/README.md)

## Hosting local server with docker

### Prerequisites
- [Install docker](https://docs.docker.com/desktop/install/windows-install/)
- [Install docker-compose](https://docs.docker.com/compose/install/)
- Follow the guideline in application-dev.properties in /back-end and configure properly

### Generate RSA key pair for both access tokens and refresh tokens

These key pairs will be used for Jwt signature, you can uncomment line 86-113 in KeyUtil.java for the application to generate the key pairs and store them, if you don't wish to generate the key pairs yourself.

### Start the application

Run the following line
```
docker-compose -f docker-compose.yml up --build
```

This will host a local server at localhost
> frontend: port 3000 <br/>
> backend: port 8080 <br/>
> mysql: port 3306

## Hosting separate front-end and back-end service

### Prerequisites
- [Install node.js](https://nodejs.org/en/download)
- [Install MySQL](https://dev.mysql.com/downloads/workbench/)
- Follow the guideline in application-local.properties in /back-end and configure properly

### Generate RSA key pair for both access tokens and refresh tokens

These key pairs will be used for Jwt signature, you can uncomment line 86-113 in KeyUtil.java for the application to generate the key pairs and store them, if you don't wish to generate the key pairs yourself.

### Create an MySQL database
Create a MySQL database `forumdb` with a username and password, configure the application-local.properties file to match the MySQL database connection details.

### To start the back-end service
Run the application in your favourite IDE with the environment variable `-Dspring.config.name=application-local` as gradle in the back-end directory

### To start the front-end service
Run the application with `npm start` in the front-end directory
