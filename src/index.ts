import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
app.use(cors());
routes(app);

const port = process.env.NODE_ENV === 'production' ? 80 : 8080;

app.listen(port, () => {
    console.log('Node client started on port:', port);
});

process.on('SIGINT', () => {
    process.exit(0);
});

process.on('unhandledRejection', (err: Error) => {
    console.log(err.message);
    process.exitCode = 1;
});