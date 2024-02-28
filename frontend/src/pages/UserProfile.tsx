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
    email: z.string().email("This is not a valid email").max(50),
    institution: z.string(),
    agreement: z.string().max(2000),

    // link to tourney dashboard instead (?)
    // judging: z.array(z.string()).optional(),
    // participating: z.array(z.string()).optional(),
    // hosting: z.array(z.string()).optional();
})


const UserProfile = () => {
  const defaultUser = {
    username: "",
    name: "",
    email: "",
    institution: "",
    agreement: "",
    // participating: [],
    // judging: [],
    // hosting: []
  }

  const [ userInfo, setUserInfo ] = useState<User>(defaultUser);
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const userIDPlaceholder = "65d69c469d47c04d60421fdb";

  
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // initially empty before fetch
    defaultValues: userInfo
  })

  // monitor form edits
  const { isDirty, dirtyFields } = form.formState;

  // fetch initial user info
  useEffect(()=>{
    // api should not return password. may want to return id?
    axios.get(`users/${userIDPlaceholder}`)
    .then(res => {
      console.log(res.data);
      const userRes : User = res.data;
      setUserInfo(userRes);
    })
    .catch(err => console.log(err))
      
  }, [form, setUserInfo])

  // set form default everytime userInfo is changed
  useEffect(() => {
    form.reset(userInfo);
  }, [userInfo, form])

  function onSubmit(data: z.infer<typeof formSchema>) {

    // Initialize an object to hold the updated values.
    const updatedValues: Partial<z.infer<typeof formSchema>> = {};

    // Iterate over dirtyFields to determine which fields have been modified.
    Object.keys(dirtyFields).forEach((key) => {
      const fieldKey = key as keyof z.infer<typeof formSchema>;
      if (dirtyFields[fieldKey]) {
        updatedValues[fieldKey] = data[fieldKey];
      }
    });

    console.log(updatedValues);
    axios.put(`users/${userIDPlaceholder}`, updatedValues)
      .then(res => {
        const test = res.data;
        console.log(test);
        setUserInfo(userInfo => ({...userInfo, ...updatedValues}))
      })
      .catch(err => {
        console.log(err);
      })

    setIsEditing(false);
    
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <div className="w-11/12 md:w-2/3 lg:w-1/2 xl:max-w-lg flex flex-col bg-white rounded-lg p-5 shadow-lg space-y-5">
        
        <div className="flex flex-col items-center space-y-3">
            <img src="/walterworth.png"
              alt = "Avatar"
              className="rounded-full h-24 w-24"
            />
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Hey Dino, here's your profile!
            </p>
        </div>
        
        <Separator/>
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        readOnly={!isEditing} 
                        placeholder="Your Name" 
                        {...field} 
                      />
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
                        readOnly={!isEditing}
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
                    <Input 
                      readOnly={!isEditing} 
                      placeholder="Who you repping?" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {
              // if editing + fields have changed
              isEditing && 
              isDirty && 
              <Button type="submit" disabled={form.formState.isSubmitting}>Save Changes</Button>
            }

            </form>
          </Form>
          <div className="flex justify-center space-x-4">
            {!isEditing &&
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>}
            {isEditing && <Button type="button" onClick={() => setIsEditing(false)}>Stop Editing</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
