import { FastifyInstance } from "fastify";




export default async function messageRoutes(fastify: FastifyInstance) {
    fastify.io.on("message", () => { })
}