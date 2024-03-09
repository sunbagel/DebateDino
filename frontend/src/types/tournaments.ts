export type Tournament = {
    host: string,
    name: string,
    description: string,
    date: string,
    location: string,
    refundPolicy: string,
    judges: Array<string>,
    participants: Array<string>,
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

