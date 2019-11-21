import 'dotenv/config';
import cors from 'cors';
import express from 'express';
// import uuidv4 from 'uuid/v4';
import routes from './routes';
import models, {
  connectDb
} from './models';


const app = express();
const eraseDatabaseOnSync = true;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(async (req, res, next) => {
  req.context = {
    models,
  };

  next();
});

app.use('/session', routes.session);
app.use('/user', routes.user);
app.use('/message', routes.message);
app.use('/log', routes.log);

app.get('/', (req, res) => {
  return res.send(':)');
});

console.log('Connecting to DB...');
connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
    ]);
    createUsersWithMessages();
  }
  console.log('Connecting to DB... Success!');
  app.listen(process.env.PORT, () =>
    console.log('SERVER LISTENING ON PORT ' + process.env.PORT),
  );
});


const createUsersWithMessages = async () => {
  const user1 = new models.User({
    username: 'admin',
    password: 'admin',
    authToken: '',
  });
  await user1.save();
};