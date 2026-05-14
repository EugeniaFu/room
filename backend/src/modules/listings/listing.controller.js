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
          title: req.body.title,
          description: req.body.description,

          price: parseFloat(req.body.price),

          type: req.body.type,

          country: req.body.country,
          state: req.body.state,
          city: req.body.city,

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