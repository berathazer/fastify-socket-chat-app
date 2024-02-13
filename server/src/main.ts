import { buildServer } from './config/setup-server';
import Redis from "ioredis"
import { CONNECTION_COUNT_KEY, CORS_ORIGIN, HOST, PORT, UPSTASH_REDIS_REST_URL, connectedClient } from './config/constant';
import closeWithGrace from "close-with-grace"




if (!UPSTASH_REDIS_REST_URL) {
    console.error('UPSTASH_REDIS_REST_URL is not defined');
    process.exit(1);
}



export const publisher = new Redis(UPSTASH_REDIS_REST_URL);
export const subscriber = new Redis(UPSTASH_REDIS_REST_URL);



async function main() {
    const app = await buildServer(CORS_ORIGIN, PORT);

    try {
        await app.listen({
            port: PORT,
            host: HOST
        });

        closeWithGrace({ delay: 2000 }, async ({ signal, err }) => {
            console.log("Shutting down server");

            if (connectedClient > 0) {
                console.log(`Removing ${connectedClient} from the count`);
                const currentCount = parseInt(await publisher.get(CONNECTION_COUNT_KEY) || '0', 10)

                const newCount = Math.max(currentCount - connectedClient, 0);

                await publisher.set(CONNECTION_COUNT_KEY, newCount.toString());
            }

            await app.close();

            console.log("Shutdown completed");

        })

        console.log(`Server is running on http://${HOST}:${PORT}`);


    } catch (error) {
        console.error(error);
        process.exit(1);

    }
}




main();


