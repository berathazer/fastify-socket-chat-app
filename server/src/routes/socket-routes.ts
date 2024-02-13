import { FastifyInstance } from "fastify";
import { publisher, subscriber } from "../main";
import { CONNECTION_COUNT_KEY, CONNECTION_COUNT_UPDATED_CHANNEL, NEW_MESSAGE_CHANNEL, PORT, decrementConnectedClient, incrementConnectedClient } from "../config/constant";
import { randomUUID } from "crypto";






export default async function socketRoutes(fastify: FastifyInstance, options: Record<string, unknown>) {

    fastify.io.on("connection", async (io) => {
        incrementConnectedClient();

        const increment = await publisher.incr(CONNECTION_COUNT_KEY);

        await publisher.publish(CONNECTION_COUNT_UPDATED_CHANNEL, increment.toString());



        io.on(NEW_MESSAGE_CHANNEL, async (payload) => {
            const message = payload.message;
            if (!message) return;

            await publisher.publish(NEW_MESSAGE_CHANNEL, message.toString());
        })



        io.on("disconnect", async () => {
            decrementConnectedClient();
            const decrement = await publisher.decr(CONNECTION_COUNT_KEY);

            await publisher.publish(CONNECTION_COUNT_UPDATED_CHANNEL, decrement.toString());
        })
    })

    subscriber.subscribe(CONNECTION_COUNT_UPDATED_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${CONNECTION_COUNT_UPDATED_CHANNEL}`, err);
            return;
        }
        console.log(`${count} clients subscribes to ${CONNECTION_COUNT_UPDATED_CHANNEL} channel`);
    })


    subscriber.subscribe(NEW_MESSAGE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${NEW_MESSAGE_CHANNEL}`, err);
            return;
        }
        console.log(`${count} clients subscribes to ${NEW_MESSAGE_CHANNEL} channel`);

    })



    subscriber.on("message", (channel, message) => {
        if (channel === CONNECTION_COUNT_UPDATED_CHANNEL) {

            fastify.io.emit(CONNECTION_COUNT_UPDATED_CHANNEL, {
                count: message
            })

            return;
        }


        if (channel === NEW_MESSAGE_CHANNEL) {
            fastify.io.emit(NEW_MESSAGE_CHANNEL, {
                id: randomUUID(),
                message,
                createdAt: new Date(),
                port: PORT
            })
        }
    })
}