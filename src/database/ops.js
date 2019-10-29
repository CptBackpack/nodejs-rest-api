// ./src/database/ops.js
const {getDatabase} = require('./mongo');
const collectionName = 'ops';
const {ObjectID} = require('mongodb');

async function insertOp(op) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(op);
  return insertedId;
}

async function updateOp(id, op) {
  const database = await getDatabase();
  delete op._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...op,
      },
    },
  );
}

async function getOps() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

async function deleteOp(id) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

module.exports = {
  insertOp,
  getOps,
  deleteOp,
  updateOp,
};