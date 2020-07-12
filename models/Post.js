const mongoose = require('mongoose');
const db = require('../config/db');

var Moniker = require('moniker');
var postNames = Moniker.generator([Moniker.adjective, Moniker.verb,  Moniker.noun]);
const postSchema = mongoose.Schema({
  createdBy: {
    type: String,
    required: true
  },
  postName:{
    type:String,
    default:postNames.choose()
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  contentURL: {
    type: String,
    default: null
  },
  views: {
    type: Number,
    default: 0
  }
});

const Model = db.model('Post', postSchema);

async function get(_id) {
  const model = await Model.findOne(
    {_id},
    {__v: 0}
  );
  return model;
}

async function list() {
  return await Model.find({});
}

async function create(fields) {
  const model = new Model(fields);
  await model.save();
  return await get(model._id);
}
async function incrementView(_id){
  const model = await get(_id);
  model.views = model.views+1;
  await model.save();
  return model;
}

module.exports = {
  get,
  list,
  create,
  incrementView,
  model: Model
}