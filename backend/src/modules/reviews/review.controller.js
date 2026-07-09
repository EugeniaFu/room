import * as reviewService from './review.service.js';

export const createReview = async (req, res) => {

  try {

    const review = await reviewService.createReview(
      req.user.userId,
      req.body.matchId,
      req.body.rating,
      req.body.comment,
      req.body.category
    );

    res.json(review);

  } catch (err) {

    res.status(400).json({
      error: err.message,
    });
  }
};

export const getReviewsForUser = async (req, res) => {

  try {

    const result = await reviewService.getReviewsForUser(
      req.params.userId
    );

    res.json(result);

  } catch (err) {

    res.status(400).json({
      error: err.message,
    });
  }
};
