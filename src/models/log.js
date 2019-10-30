import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date()
  }
});

const Log = mongoose.model('Log', logSchema);

export default Log;