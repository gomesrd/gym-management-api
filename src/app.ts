import fastify from 'fastify';
import {routers} from "./routers";
import {listenServer} from "./listen";

export const server = fastify();

async function main() {
    await routers(server);
    try {
        listenServer();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main().then(r => r);