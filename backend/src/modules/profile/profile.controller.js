import * as profileService from './profile.service.js';
import prisma from '../../config/prisma.js';

export const createProfile = async (req, res) => {
  try {

    const userId = req.user.userId;

    const profile = await profileService.createProfile(
      userId,
      req.body
    );

    res.json(profile);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {

    const profile = await profileService.getMyProfile(
      req.user.userId
    );

    res.json(profile);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {

    const profile = await profileService.updateProfile(
      req.user.userId,
      req.body
    );

    res.json(profile);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

export const getProfileById = async (req, res) => {
  try {

    const profile = await profileService.getProfileById(
      req.params.id
    );

    res.json(profile);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

export const uploadProfileAvatar =
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error:
            'Imagen requerida',
        });
      }

      const avatarUrl =
        `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

      const profile =
        await prisma.profile.update({
          where: {
            userId:
              req.user.userId,
          },

          data: {
            avatarUrl,
          },
        });

      res.json(profile);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error:
          'Error subiendo avatar',
      });
    }
  };