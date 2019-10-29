import 'dotenv/config';
import cors from 'cors';
import express from 'express';
// import uuidv4 from 'uuid/v4';
import routes from './routes';
import models from './models/models';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  req.context = {
    models,
    me: models.users[1],
  };
  next();
});

app.use('/session', routes.session);
app.use('/user', routes.user);
app.use('/message', routes.message);



app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});



app.listen(process.env.PORT, () =>
  console.log('Example app listening on port ' + process.env.PORT),
);