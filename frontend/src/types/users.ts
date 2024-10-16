import { Tournament } from "./tournaments"

export interface BaseUser  {
    username: string,
    name: string,
    email: string,
    phoneNumber: string,
    institution: string,
    agreement: string,
}

export interface TournamentUser {
    hosting: Array<Tournament>, // should really just be an array of tournament ids
    debating: Array<Tournament>,
    judging: Array<Tournament>
}

export interface RegisterUser extends BaseUser, TournamentUser {
    // fb_id: string | undefined,
    password: string,
}