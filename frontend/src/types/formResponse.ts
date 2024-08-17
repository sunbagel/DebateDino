import { z } from "zod";

type QnA = {
    questionId: string;
    answer: string;
}

type Member = {
    memberResponses: Array<QnA>;
}

type Team = {
    teamResponses: Array<QnA>;
    members: Array<Member>
}

export type FormResponse = {
    userId: string;
    generalResponses: Array<QnA>;
    teams: Array<Team>
}


export const formResponseSchema = z.object({
    userId: z.string(),
    generalResponses: z.array(z.object({
        questionId: z.string(),
        answer: z.string()
    })),
    teams: z.array(z.object({
        teamResponses: z.array(z.object({
            questionId: z.string(),
            answer: z.string()
        })),
        members: z.array(z.object({
            memberResponses: z.array(z.object({
                questionId: z.string(),
                answer: z.string()
            }))
        }))
    }))
})
