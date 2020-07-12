var express = require('express');
var router = express.Router();
const UserModel = require('../models/User');

router.post('/create', async function (req, res, next) {
  try {
    const ipInfo = req.ipInfo;
    const {fcmToken} = req.body;
    if(!ipInfo.ip)
      ipInfo.ip= 'localTesting';
    const user = await UserModel.create({...ipInfo, fcmToken});
    res.json({user});
  } catch (err) {
    console.log("error", err);
    res.status(500).json({error: err});
  }
});


module.exports = router;
