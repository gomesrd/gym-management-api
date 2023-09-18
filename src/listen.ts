import {server} from "./app";

export function listenServer() {
    server.listen(
        {
            port: 3000,
            host: '0.0.0.0',
        }
    ).then(r => r);
    console.log('Server running at http://localhost:3000')

}