import express from 'express';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import listingRoutes from './modules/listings/listing.routes.js';
import connectionRequestRoutes from './modules/connectionRequests/connectionRequest.routes.js';
import conversationRoutes from './modules/conversations/conversation.routes.js';
import discoverRoutes from './modules/discover/discover.routes.js';
import matchRoutes from './modules/matches/match.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { roleMiddleware } from './middleware/role.middleware.js';

import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

app.get('/private', authMiddleware, (req, res) => {
  res.json({
    message: 'Ruta privada',
    user: req.user
  });
});

app.get(
  '/admin',
  authMiddleware,
  roleMiddleware('admin'),
  (req, res) => {
    res.json({
      message: 'Bienvenido admin'
    });
  }
);

app.get(
  '/host',
  authMiddleware,
  roleMiddleware('host'),
  (req, res) => {
    res.json({
      message: 'Panel host'
    });
  }
);

app.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware('roomie', 'host'),
  (req, res) => {
    res.json({
      message: 'Dashboard usuario'
    });
  }
);

app.use(
  '/uploads',
  express.static(
    path.resolve('uploads')
  )
);



app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/listings', listingRoutes);
app.use('/connection-requests', connectionRequestRoutes);
app.use('/conversations', conversationRoutes);
app.use('/discover', discoverRoutes);
app.use('/matches', matchRoutes);
export default app;