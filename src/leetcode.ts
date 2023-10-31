import { Request, Response } from 'express';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ObjectValue } from './types';

const {
    LEETCODE_API_URL,
    USER_AGENT,
    STORAGE_NAME,
} = process.env;

const STORAGE_FILE_NAME = 'leetcode-counter.txt';
const s3 = new S3Client();
let totalSolved = 0;

function parseCookie(cookie: string) {
    return cookie
        .split(';')
        .map((x) => x.trim().split('='))
        .reduce((acc, x) => {
            acc[x[0]] = x[1];
            return acc;
        }, {} as ObjectValue);
}

export async function syncTotalSolved(req: Request, res: Response) {
    if (!LEETCODE_API_URL || !USER_AGENT || !STORAGE_NAME) {
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

    await s3.send(
        new PutObjectCommand({
            Bucket: STORAGE_NAME,
            Key: STORAGE_FILE_NAME,
            Body: body.totalSolved.toString(),
        })
    );

    totalSolved = body.totalSolved;
    res.end();
}

export async function getTotalSolved(req: Request, res: Response) {
    if (totalSolved === 0) {
        const { Body } = await s3.send(
            new GetObjectCommand({
                Bucket: STORAGE_NAME,
                Key: STORAGE_FILE_NAME,
            })
        );
        const value = await Body?.transformToString();
        totalSolved = Number(value);
    }
    res.end(totalSolved?.toString());
}