import axios from "@/lib/axios";
import { Card, CardContent, CardFooter, CardHeader } from "@/shadcn-components/ui/card";
import { FormResponse, formResponseSchema } from "@/types/formResponse";
import { Tournament } from "@/types/tournaments";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/shadcn-components/ui/form"
import { Button } from "@/shadcn-components/ui/button";
import QuestionPicker from "@/components/tournament/QuestionPicker";
import MemberForm from "@/components/tournament/MemberForm";


export type Inputs = z.infer<typeof formResponseSchema>




const TournamentRegister = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    const form = useForm<Inputs>({
        resolver: zodResolver(formResponseSchema),
        defaultValues: {
            userId: "65d69c469d47c04d60421fdb",
            generalResponses: [],
            teams: [{
                teamResponses: [],
                members: [{
                    memberResponses: []
                }]
            }]
        }
    })
    const {fields: teamsFields, append: teamAppend, remove: teamRemove} = useFieldArray({
        name: "teams",
        control: form.control
    })

    const [tournament, setTournament] = useState<Tournament>();

    const processForm: SubmitHandler<Inputs> = (values: z.infer<typeof formResponseSchema>) => {
        console.log(JSON.stringify(values));
        axios.post(`tournaments/${id}/registrations`, values);
        navigate('/tournaments')
    }

    useEffect(() => {
        axios.get(`tournaments/${id}`)
        .then(res => {
            console.log(res.data);
            setTournament(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [id])

    

    return (
        <div className="container mx-auto flex min-h-screen flex-col pb-10">
            <div className="flex pt-10 h-96 justify-center relative items-center" >
                <div className="rounded-3xl w-full h-full absolute bg-cover bg-cente" style={{backgroundImage: 'url("../../public/walterworth.png")'}}/>
                <div className="z-0 w-full h-full absolute bg-gray-300 blur-md opacity-80"></div>
                <img className="h-96 z-10" src="../../walterworth.png"></img>
            </div>
            <h1 className="text-3xl font-bold pt-10">{tournament?.name}</h1>
            <div className="pt-10 justify-between">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <h1 className="text-2xl font-bold">General Questions</h1>
                            </CardHeader>
                            <CardContent>
                                {tournament?.form.questions.map((question, index) => {
                                    if (!form.getValues(`generalResponses.${index}`)) {
                                        form.setValue(`generalResponses.${index}`, {
                                            questionId: question._id,
                                            answer: ""
                                        })
                                    }
                                    return (
                                        <div key={index}>
                                            <FormField
                                                control={form.control}
                                                name={`generalResponses.${index}.answer`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{question.text}</FormLabel>
                                                        <FormControl>
                                                            <QuestionPicker field={field} type={question.type} options={question.options ? question.options : []} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                        <div>
                            <div className="flex flex-col">
                                {teamsFields.map((f, teamIdx) => {
                                    return (
                                        <Card key={f.id} className="mb-8">
                                            <CardHeader className="flex flex-row justify-between">
                                                <h1 className="text-xl font-bold">Team #{teamIdx+1}</h1>
                                                <Button variant="ghost" onClick={() => {teamRemove(teamIdx)}}>
                                                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                                </Button>
                                            </CardHeader>
                                            <CardContent>
                                                {tournament?.form.teamQuestions.map((teamQuestion, teamQuestionIdx) => {
                                                    if (!form.getValues(`teams.${teamIdx}.teamResponses.${teamQuestionIdx}`)) {
                                                        form.setValue(`teams.${teamIdx}.teamResponses.${teamQuestionIdx}`, {
                                                            questionId: teamQuestion._id,
                                                            answer: ""
                                                        })
                                                    }
                                                    return (
                                                        <div key={teamQuestionIdx}>
                                                            <FormField
                                                                control={form.control}
                                                                name={`teams.${teamIdx}.teamResponses.${teamQuestionIdx}.answer`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>{teamQuestion.text}</FormLabel>
                                                                        <FormControl>
                                                                            <QuestionPicker field={field} type={teamQuestion.type} options={teamQuestion.options ? teamQuestion.options : []} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </CardContent>
                                            <CardContent>
                                                <MemberForm teamIdx={teamIdx} form={form} tournament={tournament} />
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                            <div>
                                <Button disabled={!(tournament && form.getValues('teams').length < tournament.maxTeams)} onClick={() => teamAppend({
                                    teamResponses: [],
                                    members: [{
                                        memberResponses: []
                                    }]
                                })} type="button" className="w-full">
                                    {tournament && form.getValues('teams').length < tournament.maxTeams && (
                                        <p>Add Team</p>
                                    )}
                                    {!(tournament && form.getValues('teams').length < tournament.maxTeams) && (
                                        <p>You have reached the maximum number of teams.</p>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button type="submit">Register</Button>
                    </form>
                </Form>
            </div>
            
        </div>

    )

}


export default TournamentRegister;


