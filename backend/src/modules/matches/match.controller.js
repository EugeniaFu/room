import * as service
from './match.service.js';

export const getPotentialMatches =
  async (req, res) => {

    try {

      const matches =
        await service.getPotentialMatches(
          req.user.userId
        );

      res.json(matches);

      }catch (error) { console.log(error); res.status(500).json({ error: error.message }); }
  };
  
  export const likeUser =
  async (req, res) => {

    try {

      const result =
        await service.likeUser(
          req.user.userId,
          req.params.id
        );

      res.json(result);

 }catch (error) { console.log(error); res.status(500).json({ error: error.message }); }
  };

export const skipUser =
  async (req, res) => {

    try {

      const result =
        await service.skipUser(
          req.user.userId,
          req.params.id
        );

      res.json(result);

 }catch (error) { console.log(error); res.status(500).json({ error: error.message }); }
  };

  export const getReceivedLikes =
  async (req, res) => {

    try {

      const likes =
        await service.getReceivedLikes(
          req.user.userId
        );

      res.json(likes);

 }catch (error) { console.log(error); res.status(500).json({ error: error.message }); }
  };