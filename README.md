
# HeckerGround
Heckerground is an Australia online anonymous forum built using Spring Boot and React.
This platform is developed with an intention to provide people in Australia a platform to ask any questions, comment on current issues or just complain on trivial matters in daily life.

Heckerground is fully anonymous, every users are equal. Fame, wealth, title does not grant anyone priviledge.
State your most insane take, start a full blown argument against someone at the most unhinged place in the internet! "*Best Restaurant in Melbourne CBD is xxx*" "*Pizza or sushi?*" "*React or Angular?*"

Agree or disagree by smashing the upvote/downvote button!
No inbetween option, just a simple yes or no, the only thing meaningful here is the number of people agreeing/disagreeing , to know where the majority stands.

No more [deleted] comments like you see in reddit, Heckerground prevent this by disabling the ability to delete any comments, don't let this discourage you from posting comment, who cares if you make a typo in the comment or left a regretful comment. After all, it is all anonymous.

> Note: User can not delete, edit or undo post/comment/vote, unless the content violates the terms
> and conditions.

You can treat this as an anonymous survey site or an online forum with bare minimum moderation, just keep in mind that everything is fully anonymous and please do not dox yourself.

Source code for Heckerground is publicly available to reinforce the idea that the website is fully secured and no personal details can be leaked.

## Architecture Diagrams
[Diagrams shown here](Artifacts/README.md)

## Hosting local server with docker

### Prerequisites
- [Install docker](https://docs.docker.com/desktop/install/windows-install/)
- [Install docker-compose](https://docs.docker.com/compose/install/)
- Follow the guideline in application-dev.properties in /back-end and configure properly

### Generate RSA key pair for both access tokens and refresh tokens

These key pairs will be used for Jwt signature, name the keys as ```public.key``` and ```private.key``` then place them in ```\back-end\access-refresh-token-keys\access-keys```
The application will generate random key pairs and store them if no keys are found in the above file path.

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

These key pairs will be used for Jwt signature, name the keys as ```public.key``` and ```private.key``` then place them in ```\back-end\access-refresh-token-keys\access-keys```
The application will generate random key pairs and store them if no keys are found in the above file path.

### Create an MySQL database
Create a MySQL database `forumdb` with a username and password, configure the application-local.properties file to match the MySQL database connection details.

### To start the back-end service
Run the application in your favourite IDE with the environment variable `-Dspring.config.name=application-local` as gradle in the back-end directory

### To start the front-end service
Run the application with `npm start` in the front-end directory
