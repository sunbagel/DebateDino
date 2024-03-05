import { Card, CardContent } from '@/shadcn-components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shadcn-components/ui/form'
import { Input } from '@/shadcn-components/ui/input'
import { Switch } from '@/shadcn-components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import {z} from 'zod';


const shortAnswerSchema = z.object({
    isrequired: z.boolean(),
    type: z.string(),
    text: z.string(),
    answer: z.string(),
})


function ShortAnswer() {

    const shortAnswerForm = useForm<z.infer<typeof shortAnswerSchema>>({
        resolver: zodResolver(shortAnswerSchema),
        defaultValues: {
            isrequired: false,
            type: "input",
            text: ""
        },
    })

    
    return (
        <Card className='pt-5 mt-5'>
            <CardContent>
                <Form {...shortAnswerForm}>
                    <FormField
                    control={shortAnswerForm.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Unnamed Question" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={shortAnswerForm.control}
                    name="answer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <Input placeholder="Short Answer Text" disabled {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={shortAnswerForm.control}
                    name="isrequired"
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
                </Form>
            </CardContent>
        </Card>
    )
}

export default ShortAnswer