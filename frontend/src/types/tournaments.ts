import { z } from "zod"

export type Tournament = {
    _id?: string;
    host: string,
    name: string,
    description: string,
    date: string,
    location: string,
    refundPolicy: string,
    judges: Array<string>,
    debaters: Array<string>,
    image: string,
    form: {
        questions: [
            {
                type: string,
                text: string,
                isRequired: boolean
            }
        ]
    }
}

export const tournamentSchema = z.object({
    host: z.string(),
    name: z.string().min(1, {
      message: "Name is required",
    }).max(20),
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
        }))
    })
})

export const defaultTournament: Tournament = {
    host: "65d69c469d47c04d60421fdb",
    name: "",
    description: "",
    date: "",
    location: "",
    refundPolicy: "",
    judges: [],
    debaters: [],
    image: "image url placeholder?",
    form: {
        questions: [
            {
                type: "",
                text: "",
                isRequired: false
            }
        ]
    }
}

