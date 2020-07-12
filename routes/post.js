var express = require('express');
var router = express.Router();
const PostModel = require('../models/Post');
const utility = require('../utility');

router.get('/view/:postId', async function (req, res, next) {
  try {
    await PostModel.incrementView(req.params.postId);
    res.json({success: true});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err.message
    });
  }
});

router.get('/all', async function (req, res, next) {
  try {
    res.json({posts: await PostModel.list()});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err.message
    });
  }
});

router.put('/create', async function (req, res, next) {
  try {
    const mediaFile = req.files ? req.files.mediaContent : null;
    const contentURL = await utility.uploadMedia(mediaFile);
    const {userName = 'default'} = req.body;
    let post = await PostModel.create({
      createdBy: userName,
      contentURL
    });
    utility.broadcastPost(post, userName);
    res.json({post});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err.message
    });
  }
});


module.exports = router;
