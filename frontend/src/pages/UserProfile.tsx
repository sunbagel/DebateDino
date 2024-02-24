import { User } from "@/types/users"
import axios from "@/lib/axios";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
    username: "sunbagel",
    name: "alex2",
    email: "alex@gmail.com",
    institution: "Queens University",
    agreement: "i agree",
    // participating: [],
    // judging: [],
    // hosting: []
  }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: tempUser
  })

  // monitor form edits
  const { isDirty } = form.formState;

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
          <Form {...form}>
            <form className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Who you repping?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              {isDirty && <Button type="submit">Save Changes</Button>}
            </form>
          </Form>
                
      </div>

    </div>
  )
}

export default UserProfile
