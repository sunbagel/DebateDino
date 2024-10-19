import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Button } from "@/shadcn-components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn-components/ui/form"
import { Input } from "@/shadcn-components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn-components/ui/popover";
import { cn } from "@/lib/shadcn-utils";
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/shadcn-components/ui/calendar"
import { Textarea } from "@/shadcn-components/ui/textarea"
import axios from '@/lib/axios'
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shadcn-components/ui/pagination"
import { getDefaultTournament, tournamentSchema } from "@/types/tournaments"
import Question from "./questions/Question"
import useAuth from "@/hooks/useAuth"
import FormView from "@/components/FormView"


export type Inputs = z.infer<typeof tournamentSchema>

const steps = [
    {
        id: 'Step 1',
        name: 'Basic Information',
        fields: ['name', 'description', 'date', 'location', 'refundPolicy', 'debatersPerTeam', 'maxTeams', 'maxTeamSlots']
    },
    {
        id: 'Step 2',
        name: 'Form Creation',
        fields: ['questions', 'teamQuestions', 'memberQuestions']
    },
    {
        id: 'Step 3',
        name: 'Confirm',
        fields: []
    }
];

const TournamentCreation = () => {
    const navigate = useNavigate();
    const { currentUser: fbUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);

    const form = useForm<Inputs>({
        resolver: zodResolver(tournamentSchema),
        defaultValues: getDefaultTournament(fbUser?.uid ?? "") as unknown as Inputs
    })

    const {fields: questionFields, append: questionAppend, remove: questionRemove} = useFieldArray({
        name: "form.questions",
        control: form.control
    })
    const {fields: teamFields, append: teamAppend, remove: teamRemove} = useFieldArray({
        name: "form.teamQuestions",
        control: form.control
    })
    const {fields: memberFields, append: memberAppend, remove: memberRemove} = useFieldArray({
        name: "form.memberQuestions",
        control: form.control
    })

   

    const processForm: SubmitHandler<Inputs> = (values: z.infer<typeof tournamentSchema>) => {
        async function createTournament(){
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
                    },
                };
                const data = values
                console.log(data);
                const res = await axios.post(`tournaments`, data, config);
                console.log(res);
                const tournamentId = res.data.InsertedID;
                console.log(tournamentId);
                // form.reset();
                navigate('/tournaments')
            } catch (err) {
                console.error(err);
            }
            
        }
        createTournament()
        // let tournamentId;
        // console.log(values);
        // axios.post('tournaments', values)
        // .then(res => {
        //     tournamentId = res.data.InsertedID;
        //     console.log(tournamentId);
        //     form.reset();
        //     navigate('/tournaments')
        // })
        // .catch(err => {
        //     console.log(err);
        // })
    }
    
    type FieldName = keyof Inputs

    const fullValidation = async () => {
        for (let i = 0; i < steps.length - 1; i++) {
            const fields = steps[i].fields;
            if (fields.indexOf('maxTeams') > -1) {
                form.setValue(`debatersPerTeam`, parseFloat(form.getValues("debatersPerTeam")))
                form.setValue(`maxTeams`, parseFloat(form.getValues("maxTeams")))
                form.setValue(`maxTeamSlots`, parseFloat(form.getValues("maxTeamSlots")))
            }
            const output = await form.trigger(fields as FieldName[], {shouldFocus: true});
            if (!output) return 0;
            if (fields.length > 0 && fields[0] === 'form') {
                for (let i = 0; i < fields.length; i++) {
                    const type = form.getValues(`form.questions.${i}.type`);
                    if (!await form.trigger(`form.questions.${i}.type`) ||
                        !await form.trigger(`form.questions.${i}.text`) ||
                        !await form.trigger(`form.questions.${i}.isRequired`)) {
                        return 1;
                    }
                    if (type === 'select') {
                        if (!await form.trigger(`form.questions.${i}.options`)) {
                            return 1;
                        }
                    }
                }
            }
        }
        return -1;
    }

    const next = async (index = -1) => {
        const fields = steps[currentStep].fields;
        if (fields.indexOf('maxTeams') > -1) {
            form.setValue(`debatersPerTeam`, parseFloat(form.getValues("debatersPerTeam")))
            form.setValue(`maxTeams`, parseFloat(form.getValues("maxTeams")))
            form.setValue(`maxTeamSlots`, parseFloat(form.getValues("maxTeamSlots")))
        }
        const output = await form.trigger(fields as FieldName[], { shouldFocus: true });
        if (!output) return;

        if (fields.length > 0 && fields[0] === 'form') {
            for (let i = 0; i < fields.length; i++) {
                const type = form.getValues(`form.questions.${i}.type`);
                if (!await form.trigger(`form.questions.${i}.type`) ||
                    !await form.trigger(`form.questions.${i}.text`) ||
                    !await form.trigger(`form.questions.${i}.isRequired`)) {
                    return;
                }
                if (type === 'select') {
                    if (!await form.trigger(`form.questions.${i}.options`)) {
                        return;
                    }
                }
            }
        }
        if (index != -1) {
            setCurrentStep(index);
        } else if ((currentStep == steps.length - 2 && index == -1) || index == steps.length - 1) {
            const val = await fullValidation();
            if (val != -1) {
                setCurrentStep(val);
                return;
            }
            setCurrentStep(steps.length - 1);
        } else if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }

    const prev = async () => {
        const fields = steps[currentStep].fields;
        if (fields.indexOf('maxTeams') > -1) {
            form.setValue(`debatersPerTeam`, parseFloat(form.getValues("debatersPerTeam")))
            form.setValue(`maxTeams`, parseFloat(form.getValues("maxTeams")))
            form.setValue(`maxTeamSlots`, parseFloat(form.getValues("maxTeamSlots")))
        }
        const output = await form.trigger(fields as FieldName[], { shouldFocus: true });
        if (!output) return;

        if (fields.length > 0 && fields[0] === 'form') {
            for (let i = 0; i < fields.length; i++) {
                const type = form.getValues(`form.questions.${i}.type`);
                if (!await form.trigger(`form.questions.${i}.type`) ||
                    !await form.trigger(`form.questions.${i}.text`) ||
                    !await form.trigger(`form.questions.${i}.isRequired`)) {
                    return;
                }
                if (type === 'select') {
                    if (!await form.trigger(`form.questions.${i}.options`)) {
                        return;
                    }
                }

            }
        }
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }


    return (
        <div className="container mx-auto flex min-h-screen flex-col pb-10">
            <div className="pt-5 z-10">

            </div>
            <div>
                
            </div>
            <div className="pt-5 z-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
                    {currentStep === 0 && (
                        <>
                            <div className="flex flex-col">
                                <h1 className="text-5xl font-bold">Here's where it all starts</h1>
                                <br/>
                                <h2 className="text-2xl text-gray-500">Create a tournament</h2>
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tournament Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="How would you like to call it?" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your tournament name. You may change it later on.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                        <Textarea
                                            placeholder="What's your tournament about?"
                                            {...field}
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Where will your tournament be held?" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="refundPolicy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Refund Policy</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="debatersPerTeam"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Debaters per Team</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maxTeams"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Number of Teams</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maxTeamSlots"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Number of Team Slots</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    
                    {currentStep === 1 && (
                        <>
                            <div className="flex flex-col">
                                <h1 className="text-5xl font-bold">What do you want to ask your participants?</h1>
                                <br/>
                                <h2 className="text-2xl text-gray-500">Create a Form</h2>
                            </div>
                            <Question fields={questionFields} append={questionAppend} remove={questionRemove} form={form} section="questions" title="General Questions" />
                            <Question fields={teamFields} append={teamAppend} remove={teamRemove} form={form} section="teamQuestions" title="Team Questions" />
                            <Question fields={memberFields} append={memberAppend} remove={memberRemove} form={form} section="memberQuestions" title="Member Questions" />
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <div className="flex flex-col">
                                <h1 className="text-5xl font-bold">Congratulations!</h1>
                                <br/>
                                <h2 className="text-2xl text-gray-500">You've created a Debate Tournament. Review your tournament before submitting:</h2>
                            </div>
                            <Button type="submit">Submit</Button>
                        </>
                    )}
                </form>
            </Form>
            
            </div>
            <div className="pt-5">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={prev}/>
                        </PaginationItem>
                        {steps.map((_, index) => {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationLink isActive={currentStep === index} onClick={() => next(index)} href="#">{index + 1}</PaginationLink>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => next()} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    
    )

}


export default TournamentCreation;