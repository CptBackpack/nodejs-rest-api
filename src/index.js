// ./src/index.js

// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {
    startDatabase
} = require('./database/mongo');
const {
    insertOp,
    getOps,
    deleteOp,
    updateOp
} = require('./database/ops');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all Items
app.get('/', async (req, res) => {
    res.send(await getOps());
});

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://dmbackpack.eu.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: 'https://dmbackpack.eu.auth0.com/api/v2/',
    issuer: `https://dmbackpack.eu.auth0.com/`,
    algorithms: ['RS256']
  });


app.use(checkJwt);

app.post('/', async (req, res) => {
    const newOp = req.body;
    await insertOp(newOp);
    res.send({
        message: req.body
    });
});

// endpoint to delete an item
app.delete('/:id', async (req, res) => {
    await deleteOp(req.params.id);
    res.send({
        message: 'Item removed.'
    });
});

// endpoint to update an item
app.put('/:id', async (req, res) => {
    const updatedOp = req.body;
    await updateOp(req.params.id, updatedOp);
    res.send({
        message: req.body

    });
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
    await insertOp({
        title: "I AM INVALID",
        value: "0000",
        description: "1 N V 4 L 1 D"
    });


    // start the server
    app.listen(3001, async () => {
        console.log('listening on port 3001');
    });
});