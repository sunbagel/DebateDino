import { Tournament } from "./tournaments"

export interface BaseUser  {
    _id?: string
    username: string,
    name: string,
    email: string,
    phoneNumber: string,
    institution: string,
    agreement: string,
}

export interface TournamentUser {
    hosting: Array<string>, // should really just be an array of tournament ids
    debating: Array<string>,
    judging: Array<string>
}

export interface RegisterUser extends BaseUser, TournamentUser {
    // fb_id: string | undefined,
    password: string,
}