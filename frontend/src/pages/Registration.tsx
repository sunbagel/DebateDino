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
import { RegisterUser } from "@/types/users";

const formSchema = z.object({
    // name: z.string().min(2, {
    //     message: "Name must be between 2 to 20 characters.",
    // }).max(20),
    email: z.string().email("This is not a valid email").max(50),
    password: z.string(),
    name: z.string().trim().min(1, {
        message: "Name cannot be empty"
    }),
    username: z.string().trim().min(1, {
        message: "Username cannot be empty"
    }),
    phoneNumber: z.string(), // NEED BETTER VALIDATION LATER
    institution: z.string().trim().min(1, {
        message: "Institution cannot be empty"
    }),
    agreement: z.string().trim().min(1, {
        message: "Agreement cannot be empty"
    })
})

const Registration = () => {
    const { signup, deleteUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            username: "",
            phoneNumber: "",
            institution: "",
            agreement: ""
        }
    })

    const register = async (data: z.infer<typeof formSchema>) => {

        console.log(data);
        const { email, password, name, username, phoneNumber, institution, agreement } = data;
        console.log(email);
        console.log(password);

        try{
            const userCredential = await signup(email, password);
            await updateProfile(userCredential.user, { displayName: username });

            const userToken = await userCredential.user.getIdToken();
            const userData : RegisterUser = {
                fb_id: auth.currentUser?.uid,
                username,
                name,
                password,
                email,
                phoneNumber,
                institution,
                agreement,
                debating: [],
                judging: [],
                hosting: []
            };

            console.log(userData);

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            };

            const res = await axios.post('/users', userData, config)
            console.log(res);
            const from = location.state?.from?.pathname || "/";

            // replace : true ensures the user cannot navigate back to the login page after already logging in
            navigate(from, { replace: true });

        }catch(err){
            console.log("Failed to register user:", err);
            // if FB registration went through, but Mongo-side user creation failed
            // delete newly created user
            deleteUser();

            form.setError("username", 
                {
                    type: "manual",
                    message: "The username already exists. Pick a new username."
                }, 
                
                {shouldFocus: true}
            );

            
        }
    }
    return (
        <div>
            <div className="container mx-auto flex flex-col min-h-screen space-y-5">
                <h1 className="mt-10 text-5xl font-bold">Register</h1>
                <Form {...form}>
                    <form className="flex flex-col max-w-lg space-y-2" onSubmit={form.handleSubmit(register)}>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ex. Barry Allen"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field, fieldState: { error } }) => (
                                <FormItem>
                                    <FormLabel>Username:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ex. debatedino123"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>{error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

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
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="xxx-xxx-xxxx"
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
                                    <FormLabel>Institution:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ex. Queens University"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="agreement"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agreement:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="YES"
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
