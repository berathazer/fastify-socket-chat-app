import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

import { publisher } from "../main";
import { CONNECTION_COUNT_KEY } from "./constant";
import socketRoutes from "../routes/socket-routes";

export async function buildServer(CORS_ORIGIN: string, PORT: number) {
    const app = fastify();


    //cors middleware
    await app.register(fastifyCors, {
        methods: ["GET", "POST", "PUT", "DELETE"],
        origin: CORS_ORIGIN,
        credentials: true
    });

    //socket middleware
    await app.register(fastifyIO);



    const currentCount = await publisher.get(CONNECTION_COUNT_KEY)

    if (!currentCount) {
        await publisher.set(CONNECTION_COUNT_KEY, 0)
    }



    await app.register(socketRoutes, {})



    app.get("/healthcheck", () => {
        return {
            status: "ok",
            port: PORT
        }
    })
    return app
}