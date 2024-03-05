import { Card, CardContent } from '@/shadcn-components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shadcn-components/ui/form'
import { Input } from '@/shadcn-components/ui/input'
import { Switch } from '@/shadcn-components/ui/switch'
import { Textarea } from '@/shadcn-components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const longAnswerSchema = z.object({
    isrequired: z.boolean(),
    type: z.string(),
    text: z.string(),
    answer: z.string(),
  })

function LongAnswer() {
    const longAnswerForm = useForm<z.infer<typeof longAnswerSchema>>({
        resolver: zodResolver(longAnswerSchema),
        defaultValues: {
            isrequired: false,
            type: "input",
            text: ""
        },
    })
        
    return (
        <Card className='pt-5 mt-5'>
            <CardContent>
                <Form {...longAnswerForm}>
                    <FormField
                        control={longAnswerForm.control}
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
                        control={longAnswerForm.control}
                        name="answer"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <Textarea placeholder="Long Answer Text" disabled {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={longAnswerForm.control}
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

export default LongAnswer