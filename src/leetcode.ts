import { Request, Response } from 'express';
import { LeetcodeResponse } from './types';

const {
    LEETCODE_API_URL,
    USER_AGENT,
    LEETCODE_USER,
} = process.env;

let totalSolved = 0;

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

    fetch(LEETCODE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': body.cookie,
            'User-Agent': USER_AGENT,
        },
        body: JSON.stringify({
            variables: {
                username: LEETCODE_USER,
            },
            query: `
                query ($username: String!) {
                    matchedUser(username: $username) {
                        username
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }
            `,
        }),
    }).then(response => response.json() as Promise<{data: LeetcodeResponse}>).then(({ data }) => {
        const allSubmissions = data.matchedUser.submitStats.acSubmissionNum.find(item => (
            item.difficulty === 'All'
        ));
        if (allSubmissions) {
            totalSolved = allSubmissions.count;
            res.end();
        } else {
            res.status(500);
            res.end('Can\'t retrieve allSubmissions count from leetcode response');
        }
    }).catch(err => {
        res.status(500);
        res.end(err.message);
    });
}

export function getTotalSolved(req: Request, res: Response) {
    res.end(totalSolved.toString());
}