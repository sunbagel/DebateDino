import { Tournament } from "./tournaments"

export type User = {
    name: string,
    email: string,
    institution: string,
    agreement: string,
    hosting: Array<Tournament>,
    participating: Array<Tournament>,
    judging: Array<Tournament>

}