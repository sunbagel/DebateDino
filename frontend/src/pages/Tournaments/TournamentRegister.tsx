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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shadcn-components/ui/pagination";
import {Elements} from '@stripe/react-stripe-js'
import { useToast } from "@/shadcn-components/ui/use-toast";
import { ToastAction } from "@/shadcn-components/ui/toast";
import { Toaster } from "@/shadcn-components/ui/toaster";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import FormView from "@/components/FormView";
import useAuth from "@/hooks/useAuth";

export type Inputs = z.infer<typeof formResponseSchema>

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`)

const steps = [
    {
        id: 'Step 1',
        name: 'Basic Information',
        fields: ['generalResponses', 'teams.teamResponses', 'teams.members']
    },
    {
        id: 'Step 2',
        name: 'Payment',
        fields: []
    }
];


const TournamentRegister = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const {id} = useParams();
    const { currentUser: fbUser } = useAuth();

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
    const [currentStep, setCurrentStep] = useState(0);
    const [clientSecret, setClientSecret] = useState("");

    type FieldName = keyof Inputs

    const validateTeams = (response: FormResponse) => {
        const hasTeams: boolean = !!response.teams.length;
        if (!hasTeams) {
            console.log('hihihihi');
            toast({
                variant: 'destructive',
                title: "Please create some teams!",
                description: 'You must register with teams.',
                action: (
                    <ToastAction altText="close">Got it</ToastAction>
                )
            })
        }
        let hasMembers: boolean = true;
        let emptyTeam = -1;
        for (let i = 0; i < response.teams.length; i++) {
            if (response.teams[i].members.length === 0) {
                hasMembers = false;
                emptyTeam = i + 1;
                break;
            }
        }
        if (!hasMembers) {
            toast({
                variant: 'destructive',
                title: `Team ${emptyTeam} is missing members!`,
                description: 'Each team must have members.',
                action: (
                    <ToastAction altText="close">Got it</ToastAction>
                )
            })
        }
        return hasTeams && hasMembers;
    }

    const next = async (index = -1) => {
        if (currentStep === 0) {
            const isValid = await form.trigger();
            console.log(isValid);
            if (isValid) {
                form.handleSubmit(processForm)()
            }
        }
        if (index != -1) {
            setCurrentStep(index);
        } else if (currentStep + 1 < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    }

    const prev = async () => {
        const fields = steps[currentStep].fields;
        const output = await form.trigger(fields as FieldName[], { shouldFocus: true });
        if (!output) return;
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

    const processForm: SubmitHandler<Inputs> = (values: z.infer<typeof formResponseSchema>) => {
        console.log(JSON.stringify(values));
        console.log('validate', validateTeams(values))
        // navigate('/tournaments')
    }

    const submitForm = () => {
        console.log('hihih', form.getValues());
        return axios.post(`tournaments/${id}/registrations`, form.getValues())
    }

    useEffect(() => {
        // note this exact same code is in TournamentView lol
        async function fetchTournament() {
            try {
                if (!fbUser) {
                    console.error("Couldn't fetch profile - User not signed in, or user id not found");
                    return;
                }

                const token = await fbUser.getIdToken();
                // console.log(token);
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const res = await axios.get(`tournaments/${id}`, config);
                setTournament(res.data);

            } catch (err) {
                console.error(err);
            }

        }

        fetchTournament();
    }, [fbUser, id])

    useEffect(() => {
        console.log(currentStep);
        async function postPaymentIntent(){

            try{
                
                if (currentStep == 1 && !clientSecret) {
                    if (!fbUser) {
                        console.error("Couldn't fetch profile - User not signed in, or user id not found");
                        return;
                    }

                    const token = await fbUser.getIdToken();
                    // console.log(token);
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };

                    console.log('payment intent');
                    const res = await axios.post('payment-intent', { amount: 1000 }, config); // change the price when price is implemented
                    setClientSecret(res.data.client_secret);

                }
            } catch(err){
                console.error(err);
            }

        }

        postPaymentIntent();
        
    }, [fbUser, currentStep, clientSecret])

    

    return (
        <div className="container mx-auto flex min-h-screen flex-col pb-10">
            <div className="flex pt-10 h-96 justify-center relative items-center" >
                <div className="rounded-3xl w-full h-full absolute bg-cover bg-cente" style={{backgroundImage: 'url("../../public/walterworth.png")'}}/>
                <div className="z-0 w-full h-full absolute bg-gray-300 blur-md opacity-80"></div>
                <img className="h-96 z-10" src="../../walterworth.png"></img>
            </div>
            <h1 className="text-3xl font-bold pt-10">{tournament?.name}</h1>
            <div className="pt-10 justify-between">
                {currentStep === 0 && (
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
                                                            <FormLabel>{question.text} {question.isRequired && '*'}</FormLabel>
                                                            <FormControl>
                                                                <QuestionPicker field={field} type={question.type} options={question.options ? question.options : []} isRequired={question.isRequired} />
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
                                                                            <FormLabel>{teamQuestion.text} {teamQuestion.isRequired && '*'}</FormLabel>
                                                                            <FormControl>
                                                                                <QuestionPicker field={field} type={teamQuestion.type} options={teamQuestion.options ? teamQuestion.options : []} isRequired={teamQuestion.isRequired} />
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
                                    <Button disabled={!(tournament && form.getValues('teams').length < tournament.maxTeamSlots)} onClick={() => teamAppend({
                                        teamResponses: [],
                                        members: [{
                                            memberResponses: []
                                        }]
                                    })} type="button" className="w-full">
                                        {tournament && form.getValues('teams').length < tournament.maxTeamSlots && (
                                            <p>Add Team</p>
                                        )}
                                        {!(tournament && form.getValues('teams').length < tournament.maxTeamSlots) && (
                                            <p>You have reached the maximum number of teams.</p>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {/* <Button type="submit">Register</Button> */}
                        </form>
                    </Form>
                )}
                {currentStep === 1 && stripePromise && clientSecret && (
                    <div className="flex flex-wrap gap-5 md:justify-between justify-center">
                        <div className="md:flex-1">
                            <FormView form={form.getValues()} tournament={tournament} />
                        </div>
                        <div className="md:flex-1">
                            <Elements stripe={stripePromise} options={{clientSecret}}>
                                <CheckoutForm submitForm={submitForm}/>
                            </Elements>
                        </div>
                    </div>
                )}
            </div>
            <div className="pt-5">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            {currentStep > 0 && (
                                <PaginationPrevious href="#" onClick={prev}/>
                            )}
                        </PaginationItem>
                        <PaginationItem>
                            {currentStep + 1 < steps.length && (
                                <PaginationNext href="#" onClick={() => next()} />
                            )}
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <Toaster />
        </div>

    )

}


export default TournamentRegister;


