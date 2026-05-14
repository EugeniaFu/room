import { Server }
from 'socket.io';

let io;

export const initSocket =
  (server) => {

    io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    io.on(
      'connection',
      (socket) => {

        console.log(
          'Usuario conectado:',
          socket.id
        );

        socket.on(
          'joinConversation',
          (conversationId) => {

            socket.join(
              conversationId
            );
          }
        );

        socket.on(
          'disconnect',
          () => {

            console.log(
              'Usuario desconectado'
            );
          }
        );
      }
    );

    return io;
  };

export const getIO =
  () => {

    if (!io) {

      throw new Error(
        'Socket no inicializado'
      );
    }

    return io;
  };