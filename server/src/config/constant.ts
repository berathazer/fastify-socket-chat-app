import dotenv from "dotenv";
dotenv.config();

export const PORT = parseInt(process.env.PORT || '3001', 10);

// host for docker
export const HOST = process.env.HOST || '0.0.0.0'

export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;


export const CONNECTION_COUNT_KEY = "chat:connection-count"
export const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated"



export const NEW_MESSAGE_CHANNEL = "chat:new-message"
export const MESSAGES_KEY = "chat:messages"



export let connectedClient = 0;

export const incrementConnectedClient = () => {
    return ++connectedClient;
}

export const decrementConnectedClient = () => {
    return --connectedClient;
}