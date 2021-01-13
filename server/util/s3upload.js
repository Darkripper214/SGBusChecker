const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const AWS_S3_HOSTNAME = process.env.AWS_S3_HOSTNAME;
const AWS_S3_ACCESSKEY_ID = process.env.AWS_S3_ACCESSKEY_ID;
const AWS_S3_SECRET_ACCESSKEY = process.env.AWS_S3_SECRET_ACCESSKEY;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const endpoint = new AWS.Endpoint(AWS_S3_HOSTNAME);
const s3 = new AWS.S3({
  endpoint,
  accessKeyId: AWS_S3_ACCESSKEY_ID,
  secretAccessKey: AWS_S3_SECRET_ACCESSKEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        originalFileName: file.originalname,
        uploadTimeStamp: new Date().toString(),
      });
    },
    key: function (request, file, cb) {
      console.log(file);
      cb(null, new Date().getTime() + "_" + file.originalname);
    },
  }),
}).single("profilepic");

const uploadProfilePic = (req, res, next) => {
  uploadS3(req, res, (error) => {
    if (error) {
      throw error;
    }
    console.log("File uploaded successfully.");
    next();
  });
};

module.exports = {
  uploadProfilePic,
};
