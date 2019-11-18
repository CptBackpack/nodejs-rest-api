![](https://github.com/CptBackpack/nodejs-rest-api/workflows/.github/workflows/nodejs.yml/badge.svg)

## nodejs-rest-api
This is a playground project that I am using to learn Express.js and other techs for Node.js back-end.


## In case you are interested...
... for any reason, it uses [MongoDB](https://www.mongodb.com/download-center/community) to store the data.
 
### Inside of  *index.js*
you have to set 
 
	const eraseDatabaseOnSync  =  true;

to false if you don't want your database to get erased at every run.

## Everything set up?
Great! Now cd to the directory and
	
    npm install
then
	
    npm start

### What can you do?
You can do **GET** requests on 

 - http://localhost:3001/user/
 - http://localhost:3001/user/:userId
 - http://localhost:3001/message/
 - http://localhost:3001/message/:messageId
 - http://localhost:3001/log/
 - http://localhost:3001/session/

You can do **POST** requests on
 - http://localhost:3001/user/
 - http://localhost:3001/message/
 - http://localhost:3001/user/checkUser/
 
You can do **DELETE** requests on
 - http://localhost:3001/user/:userId
 - http://localhost:3001/message/:messageId
