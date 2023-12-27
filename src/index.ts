import 'dotenv/config';
import setupServer from './app';

setupServer()
  .then(({server, env}) => {
    server.listen({port: env.PORT, host: env.HOST}, (err) => {
      if (err != null) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server ready at http://${env.HOST}:${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error: ', err);
  });
