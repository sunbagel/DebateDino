import { z } from "zod"

export type Tournament = {
    _id?: string;
    host: string,
    name: string,
    description: string,
    date: string,
    debatersPerTeam: number,
    maxTeams: number,
    maxTeamSlots: number,
    location: string,
    refundPolicy: string,
    judges: Array<string>,
    debaters: Array<string>,
    image: string,
    currentTeams: number,
    form: {
        questions: [
            {
                _id?: string;
                type: string,
                text: string,
                isRequired: boolean
                options?: Array<string>;
            }
        ],
        teamQuestions: [
            {
                _id?: string;
                type: string,
                text: string,
                isRequired: boolean
                options?: Array<string>;
            }
        ],
        memberQuestions: [
            {
                _id?: string;
                type: string,
                text: string,
                isRequired: boolean
                options?: Array<string>;
            }
        ],
    }
}

export const tournamentSchema = z.object({
    host: z.string(),
    currentTeams: z.number(),
    name: z.string().min(1, {
      message: "Name is required",
    }).max(50),
    description: z.string().max(2000, {
        message: "Description must be less than 2000 characters"
    }).min(1, {
        message: 'Description is required'
    }),
    date: z.date({
        required_error: "A date is required.",
    }),
    location: z.string().min(1, {
        message: 'Location is required'
    }),
    debatersPerTeam: z.number({
        required_error: 'Debaters per Team is required',
        invalid_type_error: "Debaters per Team must be a number"
    }).min(1).max(10),
    maxTeams: z.number({
        required_error: 'Maximum number of Teams is required',
        invalid_type_error: "Maximum number of Teams must be a number"
    }).min(1).max(10),
    maxTeamSlots: z.number({
        required_error: 'Team size is required',
        invalid_type_error: "Team size must be a number"
    }).min(1).max(10),
    refundPolicy: z.string().min(1, {
        message: 'Refund Policy is required'
    }),
    judges: z.array(z.string()).optional(),
    debaters: z.array(z.string()).optional(),
    image: z.string().optional(),
    form: z.object({
        questions: z.array(z.object({
            type: z.string().min(1, {
                message: 'Type is required'
            }),
            text: z.string().min(1, {
                message: 'Question is required'
            }),
            isRequired: z.boolean(),
            options: z.optional(
                z.array(z.string().min(1, {
                    message: 'Choice cannot be empty'
                })).nonempty()
            )
        })),
        teamQuestions: z.array(z.object({
            type: z.string().min(1, {
                message: 'Type is required'
            }),
            text: z.string().min(1, {
                message: 'Question is required'
            }),
            isRequired: z.boolean(),
            options: z.optional(
                z.array(z.string().min(1, {
                    message: 'Choice cannot be empty'
                })).nonempty()
            )
        })),
        memberQuestions: z.array(z.object({
            type: z.string().min(1, {
                message: 'Type is required'
            }),
            text: z.string().min(1, {
                message: 'Question is required'
            }),
            isRequired: z.boolean(),
            options: z.optional(
                z.array(z.string().min(1, {
                    message: 'Choice cannot be empty'
                })).nonempty()
            )
        })),
    })
})

export const defaultTournament: Tournament = {
    host: "65d69c469d47c04d60421fdb",
    name: "",
    description: "",
    date: "",
    debatersPerTeam: 2,
    maxTeams: 20,
    maxTeamSlots: 4,
    location: "",
    refundPolicy: "",
    judges: [],
    debaters: [],
    currentTeams: 0,
    image: "image url placeholder?",
    form: {
        questions: [
            {
                type: "",
                text: "",
                isRequired: false
            }
        ],
        teamQuestions: [
            {
                type: "",
                text: "",
                isRequired: false
            }
        ],
        memberQuestions: [
            {
                type: "",
                text: "",
                isRequired: false
            }
        ]
    }
}

