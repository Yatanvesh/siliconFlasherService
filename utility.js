const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const UserModel = require('./models/User');
const {admin} = require('./config');

const uploadLocalFile = async (path) => {
  const res = await cloudinary.uploader.upload(path);
  fs.unlinkSync(path);
  if (res && res.secure_url) {
    console.log('file uploaded to Cloudinary', res.secure_url);
  } else {
    return '';
  }
  return res.secure_url;
}

async function uploadMedia(file) {
  let contentURL = '';
  if (file && file.tempFilePath) {
    contentURL = await uploadLocalFile(file.tempFilePath);

    if (!contentURL) {
      throw new Error("Media upload failed");
    }
  }
  return contentURL;
}

async function broadcastPost(post, sender){
  const users = await UserModel.getAll();
  users.map( user=> {
    const {fcmToken} = user;
    if(!fcmToken)return;
    admin.messaging().sendToDevice(
      [fcmToken],
      {
        data: {
          "priority": "high",
          "sender": sender,
          "post": JSON.stringify(post),
        }
      },
      {
        contentAvailable: true,
        priority: 'high',
      },
    );
  })

}

module.exports = {
  uploadLocalFile,
  uploadMedia,
  broadcastPost
}