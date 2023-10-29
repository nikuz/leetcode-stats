import { Express } from 'express';
import bodyParser from 'body-parser';
import * as leetcode from './leetcode';

export default function(app: Express) {
    app.use(bodyParser.json());

    app.post('/sync-total-solved', leetcode.syncTotalSolved);
    app.get('/total-solved', leetcode.getTotalSolved);
}
