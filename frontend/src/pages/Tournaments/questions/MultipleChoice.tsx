import { Button } from '@/shadcn-components/ui/button'
import { Card, CardContent } from '@/shadcn-components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shadcn-components/ui/form'
import { Input } from '@/shadcn-components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/shadcn-components/ui/radio-group'
import { Switch } from '@/shadcn-components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
const multipleChoiceSchema = z.object({
    isrequired: z.boolean(),
    text: z.string(),
    choices: z.array(
        z.object({
            text: z.string()
        })
    ).nonempty({message: "This question must have choices"})
})
  
function MultipleChoice({form, idx}) {

    const {fields, append, remove} = useFieldArray({
        name: `form.questions.${idx}.options`,
        control: form.control
    })
    return (
        <Card className='pt-5 mt-5'>
            <CardContent>
                <FormField
                    control={form.control}
                    name={`form.questions.${idx}.text`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                                <Input placeholder="Unnamed Question" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="pt-5">
                    <FormLabel className="pt-5 pb-0">Choices</FormLabel>
                </div>
                <RadioGroup className='pt-5'>
                    {fields.map((item, index) => {
                        return (
                        <div key={item.id} className="pt-2 pb-2 flex-row flex items-center gap-3">
                            <RadioGroupItem value="default" id="r1" disabled/>
                            <FormField 
                                control={form.control}
                                name={`form.questions.${idx}.options.${index}`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button onClick={() => remove(index)}>Delete</Button>
                        </div>
                        )
                    })}
                </RadioGroup>
                <div className="pt-2">
                    <FormField 
                        control={form.control}
                        name="choices"
                        render={() => (
                            <Button onClick={() => append("")}>Add New Choice</Button>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
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
            </CardContent>
        </Card>
    )
}

export default MultipleChoice