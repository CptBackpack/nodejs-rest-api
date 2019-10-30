import mongoose from 'mongoose';
import User from './user';
import Message from './message';
import Log from './log';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }, function (err, db) {
    if (!err) {
      db.on('close', function () {
        if (this._callBackStore) {
          for (var key in this._callBackStore._notReplied) {
            this._callHandler(key, null, 'Connection Closed!');
          }
        }
      });
    } else {
      console.log('Could not connect to the database.');
    };
  });
}

const models = {
  User,
  Message,
  Log,
};

export {
  connectDb
};
export default models;