import fastify from 'fastify';
import {routers} from "./routers";
import {documentation} from "./utils/documentation";

export const server = fastify();

async function main() {
    await routers(server);

    try {
        await server.listen(
            {
                port: 3000,
                host: '0.0.0.0',
            }
        );
        console.log('Server running at http://localhost:3000')
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main().then(r => r);