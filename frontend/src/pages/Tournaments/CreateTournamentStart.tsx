import { cn } from "@/lib/shadcn-utils";
import { Button } from "@/shadcn-components/ui/button";
import { Calendar } from "@/shadcn-components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn-components/ui/form";
import { Input } from "@/shadcn-components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn-components/ui/popover";
import { Textarea } from "@/shadcn-components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns"


const CreateTournamentStart = ({part1Form, part1Submit}) => {

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:flex-1">
                <div className="flex pt-10">
                    <div className="flex flex-col">
                        <h1 className="text-5xl font-bold">Here's where it all starts</h1>
                        <br/>
                        <h2 className="text-2xl text-gray-500">Create a tournament</h2>
                    </div>
                </div>
                <div className="pt-5">
                    <Form {...part1Form}>
                        <form onSubmit={part1Form.handleSubmit(part1Submit)} className="space-y-8">
                            <FormField
                                control={part1Form.control}
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
                                control={part1Form.control}
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
                                control={part1Form.control}
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
                                control={part1Form.control}
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
                                control={part1Form.control}
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
                            {/* <Button type="submit">Next</Button> */}
                        </form>
                    </Form>
                </div>
            </div>
            <div className="w-1/2"></div>

            <div className="flex md:fixed justify-center items-center z-0 md:w-1/2 m-5 left-1/2 top-10">
                <img src="../../debaters1.png" className="w-full" alt="Debate Tournaments"/>
            </div>
        </div>
    );
}

export default CreateTournamentStart