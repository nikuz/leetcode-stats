import { Request, Response } from 'express';
import { ObjectValue } from './types';

const {
    LEETCODE_API_URL,
    USER_AGENT,
} = process.env;

let totalSolved = 0;

function parseCookie(cookie: string) {
    return cookie
        .split(";")
        .map((x) => x.trim().split("="))
        .reduce((acc, x) => {
            acc[x[0]] = x[1];
            return acc;
        }, {} as ObjectValue);
}

export function syncTotalSolved(req: Request, res: Response) {
    if (!LEETCODE_API_URL || !USER_AGENT) {
        res.status(500);
        return res.end('LEETCODE_API_URL or USER_AGENT is not specified');
    }

    const body = req.body;
    if (!body.cookie) {
        res.status(406);
        return res.end('cookie body parameter is required');
    }

    const cookies = parseCookie(body.cookie);

    if (!cookies.csrftoken || cookies.csrftoken.length < 64 || !cookies.cf_clearance || cookies.cf_clearance.length < 64 || !cookies.LEETCODE_SESSION) {
        res.status(406);
        return res.end('cookies are wrong');
    }

    totalSolved = body.totalSolved;
    res.end();
}

export function getTotalSolved(req: Request, res: Response) {
    res.end(totalSolved?.toString());
}