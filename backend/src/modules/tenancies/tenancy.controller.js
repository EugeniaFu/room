import * as tenancyService from './tenancy.service.js';

export const confirmMatch = async (req, res) => {

  try {

    const tenancy = await tenancyService.confirmMatch(
      req.user.userId,
      req.body.listingId,
      req.body.roomieId
    );

    res.json(tenancy);

  } catch (err) {

    res.status(400).json({
      error: err.message,
    });
  }
};

export const getMyTenancies = async (req, res) => {

  try {

    const tenancies = await tenancyService.getMyTenancies(
      req.user.userId
    );

    res.json(tenancies);

  } catch (err) {

    res.status(400).json({
      error: err.message,
    });
  }
};

export const endTenancy = async (req, res) => {

  try {

    const tenancy = await tenancyService.endTenancy(
      req.user.userId,
      req.params.id
    );

    res.json(tenancy);

  } catch (err) {

    res.status(400).json({
      error: err.message,
    });
  }
};
