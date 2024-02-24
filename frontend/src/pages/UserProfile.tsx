import { User } from "@/types/users"
import axios from "@/lib/axios";
import { useEffect, useState } from "react";

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
import { Separator } from "@/shadcn-components/ui/separator";
import { Input } from "@/shadcn-components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn-components/ui/popover";
import { cn } from "@/lib/shadcn-utils";
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/shadcn-components/ui/calendar"
import { Textarea } from "@/shadcn-components/ui/textarea"
import { useNavigate } from "react-router-dom"


const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be between 2 to 20 characters.",
    }).max(20),
    email: z.string().max(50),
    institution: z.string(),
    agreement: z.string().max(2000),

    // link to tourney dashboard instead (?)
    // judging: z.array(z.string()).optional(),
    // participating: z.array(z.string()).optional(),
    // hosting: z.array(z.string()).optional();
})


const UserProfile = () => {

  const [ userInfo, setUserInfo ] = useState<User>();
  const userIDPlaceholder = "65d69c469d47c04d60421fdb";

  const tempUser = {
    "name": "alex2",
    "password": "abc123",
    "email": "alex@gmail.com",
    "institution": "Queens University",
    "agreement": "i agree",
    "participating": [],
    "judging": [],
    "hosting": []
  }

  useEffect(()=>{
    // api should not return password. may want to return id?
    axios.get(`user/${userIDPlaceholder}`)
    .then(res => {
      console.log(res.data);
      const userRes : User = res.data;
      setUserInfo(userRes);
    })
    .catch(err => console.log(err))
      
  }, [setUserInfo])

  return (
    <div className="container mx-auto flex min-h-screen flex-col">
        <div className="flex pt-10 ">
        <div className="flex flex-col space-y-3">
            <img src="/walterworth.png"
              alt = "Avatar"
              className="rounded-full"
              height="100"
              width="100"
            />
            <h1 className="text-5xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Hey Dino, here's your profile!
            </p>
          </div>
        </div>
        <Separator/>
        <div className="pt-5">
          {/* <Form {...form}>
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
                </div>*/}
      </div>

    </div>
  )
}

export default UserProfile
