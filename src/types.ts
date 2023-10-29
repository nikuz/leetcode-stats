interface LeetcodeSubmission {
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard',
    count: number,
    submissions: number,
}

export interface LeetcodeResponse {
    matchedUser: {
        username: string,
        submitStats: {
            acSubmissionNum: LeetcodeSubmission[],
        },
    },
}