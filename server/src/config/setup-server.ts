import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

import { publisher } from "../main";
import { CONNECTION_COUNT_KEY } from "./constant";
import socketRoutes from "../routes/socket-routes";
import messageRoutes from "../routes/message-routes";





export async function buildServer(CORS_ORIGIN: string, PORT: number) {
    const app = fastify();

    //cors middleware
    await app.register(fastifyCors, {
        origin: CORS_ORIGIN
    });

    //socket middleware
    await app.register(fastifyIO);



    const currentCount = await publisher.get(CONNECTION_COUNT_KEY)

    if (!currentCount) {
        await publisher.set(CONNECTION_COUNT_KEY, 0)
    }



    await app.register(socketRoutes, {})
    await app.register(messageRoutes);




    app.get("/healthcheck", () => {
        return {
            status: "ok",
            port: PORT
        }
    })
    return app
}