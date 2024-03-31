import { useState } from "react";
import useAuth from "@/hooks/useAuth"
import { Button } from "@/shadcn-components/ui/button";
import axios from "@/lib/axios";
import { auth } from "@/lib/firebase-config";
import { updateProfile } from "firebase/auth"
import { useLocation, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn-components/ui/form";
import { Input } from "@/shadcn-components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    // name: z.string().min(2, {
    //     message: "Name must be between 2 to 20 characters.",
    // }).max(20),
    email: z.string().email("This is not a valid email").max(50),
    password: z.string()
})

const Registration = () => {
    const { signup } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const register = async (data: z.infer<typeof formSchema>) => {

        const { email, password } = data;
        console.log(email);
        console.log(password);

        try{
            const userCredential = await signup(email, password);
            await updateProfile(userCredential.user, { displayName: "test display" });

            const userToken = await userCredential.user.getIdToken();
            const userData = {
                fb_id: auth.currentUser?.uid,
                name: "test fb",
                password: password,
                email: email,
                institution: "University of Waterloo",
                agreement: "NO I DON'T agree",
                debating: [],
                judging: [],
                hosting: []
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            };

            const res = await axios.post('users', userData, config)
            console.log(res);
            const from = location.state?.from?.pathname || "/";

            // replace : true ensures the user cannot navigate back to the login page after already logging in
            navigate(from, { replace: true });

        }catch(err){
            console.log(err);
        }
    }
    return (
        <div>
            <div className="container mx-auto flex flex-col min-h-screen space-y-5">
                <h1 className="mt-10 text-5xl font-bold">Register:</h1>
                <Form {...form}>
                    <form className="flex flex-col max-w-lg space-y-2" onSubmit={form.handleSubmit(register)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ex. barry.allen@gmail.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="my-4 text-sm rounded-md" type="submit">Register</Button>
                    </form>

                </Form>
                

            </div>
        
        </div>
    )
}

export default Registration
