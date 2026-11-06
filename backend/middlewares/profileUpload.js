const fs = require('fs');
const path = require('path');
const multer = require('multer');

const profileDirectory = path.join(__dirname, '..', 'uploads', 'profiles');
fs.mkdirSync(profileDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, profileDirectory),
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `profile-${req.user._id}-${Date.now()}${extension}`);
  }
});

const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Only image files are allowed'));
      return;
    }
    callback(null, true);
  }
}).single('profileImage');

module.exports = uploadProfileImage;
