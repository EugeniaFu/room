import * as service from './connectionRequest.service.js';

export const sendRequest =
  async (req, res) => {

    try {

      const request =
        await service.sendRequest(
          req.user.userId,
          req.body.receiverId,
          req.body.listingId
        );

      res.json(request);

    } catch (error) {

      res.status(400).json({
        error: error.message,
      });
    }
  };

export const getReceivedRequests =
  async (req, res) => {

    try {

      const requests =
        await service.getReceivedRequests(
          req.user.userId
        );

      res.json(requests);

    } catch (error) {

      res.status(400).json({
        error: error.message,
      });
    }
  };

export const acceptRequest =
  async (req, res) => {

    try {

      const request =
        await service.updateRequestStatus(
          req.params.id,
          req.user.userId,
          'ACCEPTED'
        );

      res.json(request);

    } catch (error) {

      res.status(400).json({
        error: error.message,
      });
    }
  };

export const rejectRequest =
  async (req, res) => {

    try {

      const request =
        await service.updateRequestStatus(
          req.params.id,
          req.user.userId,
          'REJECTED'
        );

      res.json(request);

    } catch (error) {

      res.status(400).json({
        error: error.message,
      });
    }
  };