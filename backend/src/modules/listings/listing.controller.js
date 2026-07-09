import * as listingService from './listing.service.js';

export const createListing = async (req, res) => {

  try {

    const imageUrls = req.files.map((file) => {

      return `${req.protocol}://${req.get('host')}/uploads/listings/${file.filename}`;

    });

    const listing =
      await listingService.createListing(
        req.user.userId,
        {
          ...req.body,

          price: parseFloat(req.body.price),

          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),

          images: imageUrls
        }
      );

    res.json(listing);

  } catch (err) {

    console.log(err);

    res.status(400).json({
      error: err.message
    });

  }
};

export const getListingById = async (req, res) => {
  try {

    const listing = await listingService.getListingById(
      req.params.id
    );

    res.json(listing);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }
};

export const updateListing = async (req, res) => {
  try {

    const listing = await listingService.updateListing(
      req.user.userId,
      req.params.id,
      req.body
    );

    res.json(listing);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }
};

export const deleteListing = async (req, res) => {
  try {

    await listingService.deleteListing(
      req.user.userId,
      req.params.id
    );

    res.json({
      message: 'Publicación eliminada'
    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }
};

export const getAllListings = async (req, res) => {
  try {

    const listings =
      await listingService.getAllListings();

    res.json(listings);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }
};

export const getMyListings = async (req, res) => {

  try {

    const listings =
      await listingService.getMyListings(
        req.user.userId
      );

    res.json(listings);

  } catch (err) {

    console.log(err);

    res.status(400).json({
      error: err.message
    });

  }
};

export const getPendingListings = async (req, res) => {

  try {

    const listings =
      await listingService.getPendingListings();

    res.json(listings);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }
};

export const reviewListing = async (req, res) => {

  try {

    const listing =
      await listingService.reviewListing(
        req.user.userId,
        req.params.id,
        req.body.decision,
        req.body.notes
      );

    res.json(listing);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }
};