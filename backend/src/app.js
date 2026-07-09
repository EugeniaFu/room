import express from 'express';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import listingRoutes from './modules/listings/listing.routes.js';
import conversationRoutes from './modules/conversations/conversation.routes.js';
import tenancyRoutes from './modules/tenancies/tenancy.routes.js';
import reviewRoutes from './modules/reviews/review.routes.js';
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
app.use('/conversations', conversationRoutes);
app.use('/tenancies', tenancyRoutes);
app.use('/reviews', reviewRoutes);
export default app;