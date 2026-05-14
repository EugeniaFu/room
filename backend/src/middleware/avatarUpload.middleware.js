import multer from 'multer';

import path from 'path';

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      'uploads/avatars'
    );
  },

  filename: (req, file, cb) => {

    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype.startsWith('image/')
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        'Solo imágenes'
      ),
      false
    );
  }
};

export const uploadAvatar =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });