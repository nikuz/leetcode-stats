import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({
    path: path.join(__dirname, '../.env.secret'),
    override: true,
});

import routes from './routes';

const app = express();
app.use(cors());
routes(app);

const port = process.env.PORT || 3000;

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