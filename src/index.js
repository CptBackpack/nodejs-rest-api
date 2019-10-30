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
    me: await models.User.findByLogin('Cthulhu'),
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
    username: 'Cthulhu',
  });
  const user2 = new models.User({
    username: 'Nyarlathotep',
  });
  const message1 = new models.Message({
    text: 'Doing housework in R\'Lyeh',
    user: user1.id,
  });
  const message2 = new models.Message({
    text: 'Happy to unleash the Apocalypse! ^_^',
    user: user2.id,
  });
  const message3 = new models.Message({
    text: 'Published a complete guidebook on how to successfully unleash the Apocalypse.',
    user: user2.id,
  });
  await message1.save();
  await message2.save();
  await message3.save();
  await user1.save();
  await user2.save();
};