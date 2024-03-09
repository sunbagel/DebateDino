import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import {motion} from 'framer-motion'
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
import { useEffect, useState } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shadcn-components/ui/pagination"
import CreateTournamentStart from "./CreateTournamentStart"
import CreateTournamentForm from "./CreateTournamentForm"
import { Tournament, defaultTournament, tournamentSchema } from "@/types/tournaments"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn-components/ui/select"
import { Card, CardContent, CardHeader } from "@/shadcn-components/ui/card"
import { Switch } from "@/shadcn-components/ui/switch"
import MultipleChoice from "./questions/MultipleChoice"


type Inputs = z.infer<typeof tournamentSchema>

const steps = [
    {
        id: 'Step 1',
        name: 'Basic Information',
        fields: ['name', 'description', 'date', 'location', 'refundPolicy']
    },
    {
        id: 'Step 2',
        name: 'Form Creation',
        fields: ['form']
    },
    {
        id: 'Step 3',
        name: 'Confirm',
        fields: []
    }
];

const CreateTournaments = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const form = useForm<Inputs>({
        resolver: zodResolver(tournamentSchema),
        defaultValues: defaultTournament as unknown as Inputs
    })

    const {fields, append, remove} = useFieldArray({
        name: "form.questions",
        control: form.control
    })

    const processForm: SubmitHandler<Inputs> = (values: z.infer<typeof tournamentSchema>) => {
        let tournamentId;
        console.log(values);
        axios.post('tournaments', values)
        .then(res => {
            tournamentId = res.data.InsertedID;
            console.log(tournamentId);
            form.reset();
            navigate('/tournaments')
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    type FieldName = keyof Inputs

    const fullValidation = async () => {
        for (let i = 0; i < steps.length - 1; i++) {
            const fields = steps[i].fields;
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
                        </>
                    )}
                    
                    {currentStep === 1 && (
                        <>
                            <div className="flex flex-col">
                                <h1 className="text-5xl font-bold">What do you want to ask your participants?</h1>
                                <br/>
                                <h2 className="text-2xl text-gray-500">Create a Form</h2>
                            </div>
                            {fields.map((f, index) => {
                                const type = form.watch(`form.questions.${index}.type`);
                                return (
                                    <div key={f.id}>
                                        <Card>
                                            <CardContent className="pt-5">
                                                <div className="flex flex-row justify-between">
                                                    <FormField
                                                        control={form.control}
                                                        name={`form.questions.${index}.type`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select Question Type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="input">Short Answer</SelectItem>
                                                                        <SelectItem value="textarea">Long Answer</SelectItem>
                                                                        <SelectItem value="select">Multi-Select</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button variant="ghost" onClick={() => {remove(index)}}>
                                                        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                                    </Button>
                                                </div>
                                                {type === 'input' && (
                                                    <Card className='pt-5 mt-5'>
                                                        <CardContent>
                                                            <FormField
                                                                control={form.control}
                                                                name={`form.questions.${index}.text`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input placeholder="Unnamed Question" {...field} />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormItem>
                                                                <FormLabel></FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Short Answer Text" disabled />
                                                                </FormControl>
                                                            </FormItem>
                                                            <FormField
                                                                control={form.control}
                                                                name={`form.questions.${index}.isRequired`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <div className="pt-4 space-y-0.5 flex flex-row items-center gap-3">
                                                                            <FormLabel>Required</FormLabel>
                                                                            <FormControl>
                                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                                            </FormControl>
                                                                        </div>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                )}

                                                {type === 'textarea' && (
                                                    <Card className='pt-5 mt-5'>
                                                        <CardContent>
                                                            <FormField
                                                                control={form.control}
                                                                name={`form.questions.${index}.text`}
                                                                render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Unnamed Question" {...field} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                            />
                                                            <FormItem>
                                                                <FormLabel></FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="Long Answer Text" disabled />
                                                                </FormControl>
                                                            </FormItem>
                                                            <FormField
                                                                control={form.control}
                                                                name={`form.questions.${index}.isRequired`}
                                                                render={({ field }) => (
                                                                <FormItem>
                                                                    <div className="pt-4 space-y-0.5 flex flex-row items-center gap-3">
                                                                        <FormLabel>Required</FormLabel>
                                                                        <FormControl>
                                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                                        </FormControl>
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                )}

                                                {type === 'select' && (
                                                    <MultipleChoice form={form} idx={index} />
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            })}
                            <div className="pt-5 flex justify-center">
                                <Button onClick={() => append({
                                    type: "",
                                    text: "",
                                    isRequired: false
                                })} className="w-full">Add Question</Button>
                            </div>
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


export default CreateTournaments;