const db = require('../config/db');
const Moniker = require('moniker');

const Model = db.model('User', {
  userName: {
    type: String,
    default: Moniker.choose
  },
  fcmToken: {
    type: String,
    required: true
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String,
    default: '',
    index: true
  },
  city: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    default: ''
  },
  ll: {
    type: Array,
    default: []
  },
})

async function get(ip) {
  const model = await Model.findOne({ip});
  return model;
}

async function create(fields) {
  const {ip} = fields;
  const existingModel = await get(ip);
  if(existingModel){
    existingModel.fcmToken = fields.fcmToken;
    await existingModel.save();
    return existingModel;
  }
  const model = new Model(fields);
  await model.save();
  return model;
}

async function getAll() {
  return await Model.find({});
}

module.exports = {
  get,
  getAll,
  create,
  model: Model
}