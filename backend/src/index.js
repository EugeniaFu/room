import http from 'http';

import app from './app.js';

import { initSocket }
from './socket.js';

const PORT =
  process.env.PORT || 3000;

const server =
  http.createServer(app);

initSocket(server);

server.listen(PORT, () => {

  console.log(
    `Servidor en puerto ${PORT}`
  );
});