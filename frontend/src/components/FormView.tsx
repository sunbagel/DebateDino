import useAuth from "@/hooks/useAuth";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader } from "@/shadcn-components/ui/card";
import { Skeleton } from "@/shadcn-components/ui/skeleton";
import { FormResponse } from "@/types/formResponse";
import { Tournament } from "@/types/tournaments";
import { BaseUser } from "@/types/users";
import { useEffect, useState } from "react";

type Props = {
    form: FormResponse;
    tournament: Tournament;
}

function FormView({form, tournament}: Props) {
    const [user, setUser] = useState<BaseUser | undefined>(undefined);
    const { currentUser: fbUser } = useAuth();

    useEffect(() => {

        async function getUser(){

            if(!fbUser){
                console.error("Couldn't fetch profile - User not signed in, or user id not found");
                return;
            }

            const token = await fbUser.getIdToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            try{
                const res = await axios.get(`users/${fbUser.uid}`, config);
                setUser(res.data);
            } catch(err){
                console.error(err);
            }
        }

        getUser();
        
    }, [fbUser,form.userId])

    if (user) {
        return (
            <Card>
                <CardHeader><h1 className="text-2xl font-bold">Review {user.name}'s registration form</h1></CardHeader>
                <CardContent>
                    <div>
                        <h2 className="text-2xl font-bold">General Questions</h2>
                        <div className="flex flex-col gap-3 mt-3">
                            {form.generalResponses.map((response, index) => {
                                return (
                                    <div key={response.questionId}>
                                        <p className="font-bold">{tournament.form.questions[index].text}</p>
                                        <p>{response.answer.length > 0 ? response.answer : <i>No answer provided.</i>}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
                <CardContent>
                    <div>
                        <h2 className="text-2xl font-bold">Team Questions</h2>
                        <div className="mt-3 flex flex-col gap-5">
                            {form.teams.map((_, teamIndex) => {
                                return (
                                    <Card key={`${teamIndex}team`}>
                                        <CardHeader><h3 className="text-1xl font-bold underline">Team #{teamIndex + 1}</h3></CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col gap-3">
                                                {form.teams[teamIndex].teamResponses.map((response, questionIndex) => {
                                                    return (
                                                        <div key={response.questionId}>
                                                            <p className="font-bold">{tournament.form.teamQuestions[questionIndex].text}</p>
                                                            <p>{response.answer.length > 0 ? response.answer : <i>No answer provided.</i>}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                        <CardContent>
                                            <div className="flex flex-row justify-center flex-wrap">
                                                {form.teams[teamIndex].members.map((_, memberIndex) => {
                                                    return (
                                                        <Card key={memberIndex}>
                                                            <CardHeader><h3 className='text-1xl font-bold underline'>Member #{memberIndex + 1}</h3></CardHeader>
                                                            <CardContent>
                                                                <div className="flex flex-col gap-3">
                                                                    {form.teams[teamIndex].members[memberIndex].memberResponses.map((response, questionIndex) => {
                                                                        return (
                                                                            <div key={response.questionId}>
                                                                                <p className="font-bold">{tournament.form.memberQuestions[questionIndex].text}</p>
                                                                                <p>{response.answer.length > 0 ? response.answer : <i>No answer provided.</i>}</p>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }
    return (
        <div>
            <Skeleton></Skeleton>
        </div>
    )
}

export default FormView