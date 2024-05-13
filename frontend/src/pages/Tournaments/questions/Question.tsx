import { Button } from '@/shadcn-components/ui/button'
import { Card, CardContent } from '@/shadcn-components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn-components/ui/form'
import { Input } from '@/shadcn-components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-components/ui/select'
import { Switch } from '@/shadcn-components/ui/switch'
import ShortAnswer from './ShortAnswer'
import LongAnswer from './LongAnswer'
import MultipleChoice from './MultipleChoice'

function Question({fields, append, remove, form, section, title}) {
    
    return (
        <>
            <h1 className="text-3xl font-bold">{title}</h1>
            {fields.map((f, index) => {
                const type = form.watch(`form.${section}.${index}.type`);
                return (
                    <div key={f.id}>
                        <Card>
                            <CardContent className="pt-5">
                                <div className="flex flex-row justify-between">
                                    <FormField
                                        control={form.control}
                                        name={`form.${section}.${index}.type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Question Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="input">Short Answer</SelectItem>
                                                        <SelectItem value="textarea">Long Answer</SelectItem>
                                                        <SelectItem value="select">Multiple Choice</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button variant="ghost" onClick={() => {remove(index)}}>
                                        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                    </Button>
                                </div>
                                {type === 'input' && (
                                    <ShortAnswer form={form} idx={index} section={section} />
                                )}

                                {type === 'textarea' && (
                                    <LongAnswer form={form} idx={index} section={section} />
                                )}

                                {type === 'select' && (
                                    <MultipleChoice form={form} idx={index} section={section} />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )
            })}
            <div className="pt-5 flex justify-center">
                <Button onClick={() => append({
                    type: "",
                    text: "",
                    isRequired: false
                })} className="w-full">Add Question</Button>
            </div>
        </>
        
    )
}

export default Question