import * as service
from './discover.service.js';

export const discoverUsers =
  async (req, res) => {

    try {

      const users =
        await service.discoverUsers(
          req.user.userId
        );

      res.json(users);


  } catch (error) { console.log(error); res.status(500).json({ error: error.message }); }
  };