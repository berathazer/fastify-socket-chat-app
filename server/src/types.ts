import { Server as SocketIOServer } from 'socket.io';
// import io instance to FastifyInstance 
declare module 'fastify' {
    interface FastifyInstance {
        io: SocketIOServer;
    }
}
