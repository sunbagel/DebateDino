import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import useAuth from "@/hooks/useAuth"


const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }).max(20),
    description: z.string().max(2000),
    date: z.date({
        required_error: "A date is required.",
    }),
    location: z.string(),
    refundPolicy: z.string(),
    // judges: z.array(z.string()).optional(),
    // participants: z.array(z.string()).optional(),
    // image: z.string().url().optional()
})
   

const CreateTournaments = ({navigation}) => {
    const navigate = useNavigate();

    const { currentUser: fbUser } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            refundPolicy: "",
            // judges: [],
            // participants: [],
            // image: "",
        },
    })
     
    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
        if (!fbUser) {
            console.error("Couldn't fetch profile - User not signed in, or user id not found");
            return;
        }
        // get token
        const token = await fbUser.getIdToken();
        // console.log(token);
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.post(`/tournaments`, data, config)
        .then(res => {
            const test = res.data;
            console.log(test);
            navigate('/tournaments')
        })
        .catch(err => {
            console.log(err);
        })
        
    }



    return (
        <div className="container mx-auto flex min-h-screen flex-col">
            <div className="flex justify-between">
                <div>
                    <div className="flex pt-10">
                        <div className="flex flex-col">
                            <h1 className="text-5xl font-bold">Create a Tournament</h1>
                        </div>
                    </div>
                    <div className="pt-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                <Button type="submit">Create Tournament</Button>
                            </form>
                        </Form>
                    </div>
                </div>
                <div className="p-20">
                    <img src="../../debatedino.png" alt="Debate Tournaments"/>
                </div>
            </div>
        </div>
    )

}


export default CreateTournaments;